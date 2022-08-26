import { ConsoleLogger, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

const waiting_room = new Array();
const matches = new Array();
const match_info = new Array();


  var user_id;

  var match_id_counter = -1;
  var room_user_counter = 0;

  const canvas_width = 800;
  const canvas_height = 600;

  const ball = {
    x : canvas_width/2,
    y : canvas_height/2,
    radius: 10,
  }

  const user_left = {
    x : 0,
    y : (canvas_height/2) - 50,
    width : 10,
    height : 100,
  }

  const user_right = {
    x : canvas_width-10,
    y : (canvas_height/2) - 50,
    width : 10,
    height : 100,
  }


  function reset_ball(match_id: number) {
    match_info[match_id].ball_x = canvas_width/2;
    match_info[match_id].ball_y = canvas_height/2;
    match_info[match_id].user_left_y = canvas_height/2 - 5;
    match_info[match_id].user_right_y = canvas_height/2 - 5;
    match_info[match_id].velocity_X = 5.00;
    match_info[match_id].velocity_Y = 5.00;
    match_info[match_id].speed = 5;
  }

  function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
  }

@WebSocketGateway()
export class GameGateway {

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized!')
  }


init_function(id: any[]) {
  if(waiting_room.length % 2 != 0){
    this.wss.to(id[0]).emit("status", [1,0,-1]);
    this.lobby_send_function();
  } else {
      match_id_counter++;
      console.log("new match id = " + match_id_counter);
      this.wss.to(waiting_room[waiting_room.length-1]).emit("status", [2,0,match_id_counter]);
      this.wss.to(waiting_room[waiting_room.length-2]).emit("status", [2,1,match_id_counter]);
  }
}



delete_match_info(match_id, user_id) {
  this.wss.to(user_id).emit("in_game", "died");
  if(matches[match_id].length > 4)
      for(var i = 4; i < matches[match_id].length; i++){
        this.wss.to(matches[match_id][i]).emit("in_game", "stop");
  }
  match_info.splice(match_id, 1, {status : "died"});
  matches.splice(match_id, 1, 0);
  this.init_function([user_id, 1]);
}


handleDisconnect(client: Socket) {
  //check disconnected user whether in waiting_room
  for(var i = 0; i < waiting_room.length; i++){
      if(waiting_room[i] == client.id)
        waiting_room.splice(i, 1);
  }

  for(var i = 0; i < matches.length; i++){
    if(matches[i][2] == client.id){
      clearInterval(matches[i][1]);
      waiting_room.push(matches[i][3]);
      this.delete_match_info(matches[i][0], matches[i][3]);
    } else if (matches[i][3] == client.id) {
        clearInterval(matches[i][1]);
        waiting_room.push(matches[i][2]);
        this.delete_match_info(matches[i][0], matches[i][2]);
    }
  }
  this.lobby_send_function();
}

lobby_send_function() {
  var send_message = [];
  for(let i = 0; i < match_info.length; i++) {
    if(match_info[i].status != "died") {
      send_message.push(match_info[i].match_id);
    }
  }
  this.wss.emit("lobby_state", send_message);
}

win_loss_function(info) {
    if(info[0] == "left") {

      

        this.wss.to(matches[info[1]][2]).emit("in_game", "won");
        this.wss.to(matches[info[1]][3]).emit("in_game", "loss");
        //to database won loss
    } else {
        this.wss.to(matches[info[1]][2]).emit("in_game", "loss");
        this.wss.to(matches[info[1]][3]).emit("in_game", "won");
        //to database won loss
    }

    if(matches[info[1]].length > 4)
      for(var i = 4; i < matches[info[1]].length; i++){
        this.wss.to(matches[info[1]][i]).emit("in_game", "stop");
    }

    match_info.splice(info[1], 1, {status : "died"});
    this.logger.log(info[1] + ". match finished")
    matches.splice(info[1], 1, 0);
    this.lobby_send_function();

}

handleConnection(client: Socket, ...args: any[]) {
  this.logger.log(`Client connect: ${client.id}`);
}

@SubscribeMessage('connection')
handleNewConnectionFunction(client: Socket, data: any) {
  //data[0] = connected/disconnection
  if(data[0] === "connected") {
    console.log(client.id + " connected successfully");
    // for(let i = 0; i < waiting_room.length; i++)
    // if(waiting_room[i][1] == data[1]){
    //   this.wss.to(client.id).emit("status", [-1, 0,-1])
    //   return
    // }
    waiting_room.push(client.id);
    this.init_function([client.id, 0])
  } else {
    this.handleDisconnect(client);
  }
}


game = (match_id: string, match_info_id ) => {
  if( match_info[match_info_id].ball_x  + match_info[match_info_id].radius < 0 ){
          match_info[match_info_id].user_right_score++;
          if(match_info[match_info_id].user_right_score > 9) {
              clearInterval(matches[match_info_id][1]);
              this.win_loss_function(["right", match_info_id]);
              return
          } //right won
          else
              reset_ball(match_info_id);

  }else if( match_info[match_info_id].ball_x  + match_info[match_info_id].radius > canvas_width){
          match_info[match_info_id].user_left_score++;
          if(match_info[match_info_id].user_left_score > 9){
              clearInterval(matches[match_info_id][1]); 
              this.win_loss_function(["left", match_info_id]);
              return
          } //left won
          else
              reset_ball(match_info_id);
  }


  match_info[match_info_id].ball_x += match_info[match_info_id].velocity_X;
  match_info[match_info_id].ball_y += match_info[match_info_id].velocity_Y;

  match_info[match_info_id].ball_x = Math.round(match_info[match_info_id].ball_x);
  match_info[match_info_id].ball_y = Math.round(match_info[match_info_id].ball_y);

//ball collision detection for up and down walls
  if(match_info[match_info_id].ball_y + match_info[match_info_id].radius > canvas_height || match_info[match_info_id].ball_y - match_info[match_info_id].radius < 0) {
    match_info[match_info_id].velocity_Y = -match_info[match_info_id].velocity_Y;
  }

  user_left.y = match_info[match_info_id].user_left_y;
  user_right.y = match_info[match_info_id].user_right_y;
  let player = (match_info[match_info_id].ball_x + match_info[match_info_id].radius < canvas_width/2) ? user_left : user_right;
  ball.x = match_info[match_info_id].ball_x;
  ball.y = match_info[match_info_id].ball_y;

  if(collision(ball, player)) {
      let collidePoint = (ball.y - (player.y + player.height/2));
      collidePoint = collidePoint / (player.height/2);
      let angleRad = (Math.PI/4) * collidePoint;
      let direction = (ball.x + match_info[match_info_id].radius < 500) ? 1 : -1;
      match_info[match_info_id].velocity_X = direction * match_info[match_info_id].speed * Math.cos(angleRad);
      match_info[match_info_id].velocity_Y = match_info[match_info_id].speed * Math.sin(angleRad);
      match_info[match_info_id].speed += 0.1;
  }

  this.wss.to(match_id).emit("in_game", match_info[match_info_id]); 
}


@SubscribeMessage('user_move')
userMouseMovementHandle(client: Socket, side: string): void {   //WsResponse<string>
  if(side[0] == "left")
    match_info[side[2]].user_left_y = side[1];
  else if(side[0] == "right")
    match_info[side[2]].user_right_y = side[1];
}

@SubscribeMessage('out-room')
outRoomRequestHandler(client: Socket, match_id): void {   //WsResponse<string>

    client.leave(match_id.toString());
    waiting_room.push(client.id);
    for (let index = 0; index < matches.length; index++)
      if(matches[index][0] == match_id)
        for(let j = 0; j < matches[index].length; j++)
          if(matches[index][j] == client.id)
            matches[index].splice(j, 1);
    this.init_function([client.id, 1])

}

@SubscribeMessage('join-room')
handleMessage(client: Socket, match_id: number) {
      client.join(match_id.toString()); 
      var flag = 1;
      for (let index = 0; index < matches.length; index++) {
          if(matches[index][0] == match_id) {
            flag = 0;

            for(var i = 0; i < waiting_room.length; i++){
                if(waiting_room[i] == client.id)
                waiting_room.splice(i, 1);
            }

            matches[index].push(client.id);
          }
      }
      
      if(flag) {
      room_user_counter ++;
      if(room_user_counter == 2) {
        
      match_info.splice(match_id_counter, 0, {
          match_id : match_id_counter,
          status: "live",
          ball_x: 500,
          ball_y: 400,
          radius: 10,
          speed: 5,
          velocity_X: 5.00,
          velocity_Y: 5.00,
          user_left_y : 200,
          user_right_y : 200,
          user_left_score : 0,
          user_right_score : 0,
      });
          
          
          var intervalId = setInterval(this.game, 1000/24, match_id.toString(), match_id_counter);

          matches.splice(match_id_counter, 0,[match_id, intervalId, waiting_room[waiting_room.length-1], waiting_room[waiting_room.length-2]]);
          waiting_room.pop();
          waiting_room.pop();
          room_user_counter = 0;
        }
      }
  }
}
