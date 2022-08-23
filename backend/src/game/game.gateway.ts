import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { userInfo } from 'os';
import { parse } from 'path/posix';
import { Socket, Server } from 'socket.io';

const dataMap = new Map();
const playerMap = new Map();
const playerQueue = [];

const canvas = {
  height : 800,
  width : 1000
}

// when COM or USER scores, we reset the ball
function resetBall(id : any){
  let ball = dataMap[id].ball
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 7;
}

// collision detection
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

// update function, the function that does all calculations
function update(id : any){
	let ball = dataMap[id].ball;
	let com = dataMap[id].com;
	let user = dataMap[id].user;
	// change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
  if( ball.x - ball.radius < 0 ){
      com.score++;
      resetBall(id);
  }else if( ball.x + ball.radius > canvas.width){
      user.score++;
      resetBall(id);
  }
  
  // the ball has a velocity
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  
  // when the ball collides with bottom and top walls we inverse the y velocity.
  if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
      ball.velocityY = -ball.velocityY;
  }
  
  // we check if the paddle hit the user or the com paddle
  let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
  
  // if the ball hits a paddle
  if(collision(ball,player)){
      // we check where the ball hits the paddle
      let collidePoint = (ball.y - (player.y + player.height/2));
      // normalize the value of collidePoint, we need to get numbers between -1 and 1.
      // -player.height/2 < collide Point < player.height/2
      collidePoint = collidePoint / (player.height/2);
      
      // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
      // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
      // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
      // Math.PI/4 = 45degrees
      let angleRad = (Math.PI/4) * collidePoint;
      
      // change the X and Y velocity direction
      let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);
      
      // speed up the ball everytime a paddle hits it.
      ball.speed += 0.1;
    }
  }
  
  @WebSocketGateway()
  export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer() wss: Server;
		
    private logger: Logger = new Logger('AppGateway');
    
    afterInit(server: Server) {
		console.log('Initialized!')
    }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnect: ${client.id}`);
  }
  

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connect: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, data): void {   //WsResponse<string>
	const parsedData = JSON.parse(data)
	if (dataMap[parsedData.id] != undefined)
		dataMap[parsedData.id].user.y = parsedData.pos;
  }

  @SubscribeMessage('onStart')
  initUser(client: Socket, data): void {   //WsResponse<string>
	const parsedData = JSON.parse(data)
	dataMap[parsedData.id] = {
		user : {
			x : 0, // left side of canvas
			y : (canvas.height - 100)/2, // -100 the height of paddle
			width : 10,
			height : 100,
			score : 0,
			color : "WHITE"
		},
		com : {
			x : canvas.width - 10, // - width of paddle
			y : (canvas.height - 100)/2, // -100 the height of paddle
			width : 10,
			height : 100,
			score : 0,
			color : "WHITE"
		  },
		net : {
			x : (canvas.width - 2)/2,
			y : 0,
			height : 10,
			width : 2,
			color : "WHITE"
		},
		ball : {
			x : canvas.width/2,
			y : canvas.height/2,
			radius : 10,
			velocityX : 5,
			velocityY : 5,
			speed : 7,
			color : "WHITE"
		}
	}
	if (playerQueue.length != 0 && dataMap[parsedData.id] == undefined) {
		let player1 = playerQueue[playerQueue.length - 1];
		let player2 = parsedData.id;
		playerMap[playerQueue.length - 1] = parsedData.id;
		playerMap[player2] = player1;
		dataMap[player2].user = dataMap[player1].com;
		dataMap[player2].com = dataMap[player1].user;
		dataMap[player2].ball = dataMap[player1].ball;
		dataMap[player2].net = dataMap[player1].net;
		playerQueue.pop();
		setInterval(()=>{
			update(player1);
		},15);
		setInterval(()=>{
			this.wss.emit(player2, JSON.stringify(dataMap[player2]));
		},15);
		setInterval(()=>{
			this.wss.emit(player1, JSON.stringify(dataMap[player1]));
		},15);
	} else {
		playerQueue.push(parsedData.id);
	}
  }
}
