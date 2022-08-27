import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';

import { Socket } from 'dgram';
import { connect } from 'http2';

import { combineLatest, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { ChannelService } from './channel.service';

/*
    {
      user_id : number,
      user_nick: string,
      is_owner: boolean,
      is_banned: boolean,
      is_muted: boolean,
      begin_time: number,
      end_time: number
    }
  */
/*
    {
      channel_name : string
      chanel_id: number
      user: any[];
      cnahel_status : string => priviet, public, protected 
      password: string,
      owner : number[]
    }
  
  */

const channels: any[] = [];

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  handleDisconnect(client: any) {
    for (let i = 0; i < channels.length; i++) {
      channels[i].setOffline(client);
    }
    console.log('disconnected');
  }
  handleConnection(client: any, ...args: any[]) {
    console.log('connected = ' + client.id);
  }
  afterInit(server: any) {
    console.log('init');
  }

  async getRandomInt(): Promise<number> {
    return Math.floor(Math.random() * 10000);
  }
  async isOnChannel(channel_name: string): Promise<boolean> {
    for (let i = 0; i < channels.length; i++) {
      if (channel_name === channels[i].getChannelName()) return true;
    }
    return false;
  }

  /*
    data {
      user_id: number,
      user_nick: string,
      channel_name: string,
      status: number,
      password: string
    }
    */
  @SubscribeMessage('CHAN')
  async handleChannel(client: any, data: any): Promise<any> {
    let com = JSON.parse(data);

    if (this.isOnChannel(com.channel_name)) {
      //client.emit() // hata
      return false; // emit yapilacak
    } else {
      let id = this.getRandomInt();
      channels.push(
        new ChannelService({
          channel_name: com.channel_name,
          channel_id: id,
          users: [
            {
              socket: client,
              user_id: com.user_id,
              user_nick: com.user_nick,
              is_owner: true,
              is_muted: false,
              is_online: true,
            },
          ],
          channel_status: com.status,
          password: com.password,
          owners: [com.user_id],
        }),
      );
      //client.emit() // chan_id
      return true;
    }
  }

  @SubscribeMessage('ONLINE')
  async handleOnline(client: any, data: any) {
    let com = JSON.parse(data);

    for (let i = 0; i < channels.length; i++) {
      if (channels[i].isInChannel(com.user_id))
        channels[i].setOnline(com.user_id, client);
    }
  }

  /*
    data {
      user_id: number,
      user_nick: string,
      channel_name: string,
      password: string
    }
    */
  @SubscribeMessage('JOIN')
  async handleChannelJoin(client: any, data: any): Promise<any> {
    let com = JSON.parse(data);
    let res: boolean;

    for (let i = 0; i < channels.length; i++) {
      // channel varsa
      if (com.channel_name === channels[i].getChannelName()) {
        res = await channels[i].addUser({
          socket: client,
          user_id: com.user_id,
          user_nick: com.user_nick,
          is_owner: false,
          is_muted: false,
          is_online: true,
          password: com.password,
        });
        if (res === false) {
          // emit olcak
          //client.emit() hata
          return false;
        } else {
          //client.emit() channels[i].chan_id
          return true;
        }
      }
    }
  }

  /*
  data {
    user_id: number,
    channel_name: string,
  }
  */
  @SubscribeMessage('LEAVE')
  async handleLeave(client: any, data: any) {
    let com = JSON.parse(data);
    for (let i = 0; i < channels.length; i++) {
      if (com.channel_name === channels[i].getChannelName()) {
        channels[i].leaveChannel(com.user_id);
      }
    }
  }

  @SubscribeMessage('PRIV')
  async handleEvent(client: any, data: any): Promise<string> {
    let com = JSON.parse(data);

    if (com.sender != '' && com.target != '') {
      console.log(com);
      this.server.emit(com.target, data);
      return data;
    }
    return undefined;
  }

  @SubscribeMessage('DM')
  async handlDirectMessage(client: any, data: any): Promise<any> {
    const com = JSON.parse(data);

    if (com.sender != '' && com.target != '') {
      console.log(com);
      this.server.emit(com.target, data);
      return data;
    }
    return undefined;
  }
}
