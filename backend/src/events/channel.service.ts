import { IoAdapter } from '@nestjs/platform-socket.io';
import { WebSocketGateway } from '@nestjs/websockets';

import { Server } from 'socket.io';

import { WebSocket } from 'ws';
import { io } from 'socket.io-client';
import { DESTRUCTION } from 'dns';

import { Socket } from 'net';
import { UserService } from 'src/user/user.service';
import { stat } from 'fs';

async function sleep(ms: number) {
  return await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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
export class ChannelService {
  private data: {
    channel_name: string;
    channel_id: number;
    users: {
      socket: any;
      user_id: number;
      user_nick: string;
      is_owner: boolean;
      is_muted: boolean;
      is_online: boolean;
    }[];
    channel_status: number;
    password: string;
    owners: number[];
    banned_users: number[];
  };

  private socket: any;

  private socket_flag: any;

  constructor(data: any) {
    this.data = data;

    this.socket = io('ws://localhost:3000');
    this.socket.addEventListener(this.data.channel_id, (data) => {
      this.sendAll(data);
    });
  }

  sendAll(data: any) {
    let com = JSON.parse(data);
    if (!this.isInChannel(com.sender)) return false;
    if (this.isBanned(com.sender)) return false;
    if (this.isMuted(com.sender)) return false;

    for (let i = 0; i < this.data.users.length; i++) {
      if (this.data.users[i].is_online === true) {
        this.data.users[i].socket.emit(this.data.channel_id, data);
      }
    }
  }

  /*
  user {
      user_id: number,
      socket: any
  }
  */
  async getChannelName(): Promise<string> {
    return this.data.channel_name;
  }

  async getChanId(): Promise<number> {
    return this.data.channel_id;
  }
  async join(user: any) {
    if (this.isInChannel(user.user_id)) return false;
    this.data.users.push(user);
  }


  async getInfo() : Promise<any>{
    const temp = this.data
    temp.users.map((user) => delete user.socket)
    return temp
  }

  async getInfoLow() : Promise<any>{
    return ({
      channel_name : this.data.channel_name,
      channel_status : this.data.channel_status,
    })
  }


  async addUser(user: any): Promise<boolean> {
    if (await this.isInChannel(user.user_id)) {
      return true;
    }
    if (await this.isBanned(user.user_id)) {
      return false;
    }
    if (
      (this.data.channel_status === 1 || this.data.channel_status === 0  )&&
      user.password === this.data.password
    ) {
      delete user.password;
      if (this.data.users.length === 0){
        user.is_owner = true;
        this.data.owners.push(user.user_id);
      }
      this.data.users.push(user);
      console.log('bad geldi')
      return true;
    }
    if (this.data.channel_status === 2) {
      if (this.data.users.length === 0){
        user.is_owner = true;
        this.data.owners.push(user.user_id);
      }
      delete user.password;
      this.data.users.push(user);
      return true;
    }
    console.log('false dondu en son')
    return false;
  }

  async addOwner(prev_owner: number, new_owner: number): Promise<boolean> {
    if (this.isOwner(prev_owner)) {
      if (!this.isOwner(new_owner)) {
        this.data.owners.push(new_owner);
        return true;
      }
    }
    return false;
  }

  async setOffline(client: any) {
    for (let i = 0; i < this.data.users.length; i++) {
      if (this.data.users[i].is_online && undefined !== this.data.users[i].socket  && client.id === this.data.users[i].socket.id) {
        this.data.users[i].is_online = false;
        this.data.users[i].socket = undefined;
        return;
      }
    }
  }

  async setOnline(user_id: number, client: any) {
    for (let i = 0; i < this.data.users.length; i++) {
      if (user_id === this.data.users[i].user_id) {
        this.data.users[i].is_online = true;
        this.data.users[i].socket = client;
        return;
      }
    }
  }

  async changeStatus(user_id: number, status: number): Promise<boolean> {
    if (this.isOwner(user_id) && status < 3 && status > 0) {
      this.data.channel_status = status;
      return true;
    } else {
      return false;
    }
  }

  async isInChannel(user_id: number): Promise<boolean> {
    for (let i: number = 0; i < this.data.users.length; i++) {
      if (user_id === this.data.users[i].user_id) 
        return true;
    }
    return false;
  }

  async isMuted(user_id: number): Promise<boolean> {
    for (let i : number = 0; i < this.data.users.length; i++) {
      if (user_id === this.data.users[i].user_id) return this.data.users[i].is_muted;
    }
    return true;
  }

  async isOwner(user_id: number): Promise<boolean> {
    for (let i : number = 0; i < this.data.owners.length; i++) {
      if (user_id === this.data.owners[i]) return true;
    }
    return false;
  }

  async isBanned(user_id: number): Promise<boolean> {
    for (let i: number = 0; i < this.data.banned_users.length; i++) {
      if (user_id === this.data.banned_users[i]) return true;
    }
    return false;
  }

  async banUser(user_id: number, banned_id: number): Promise<boolean> {
    if (!this.isInChannel(user_id)) return false;
    if (!this.isInChannel(banned_id)) return false;
    if (this.isOwner(banned_id)) return false;
    if (!this.isOwner(user_id)) return false;

    for (let i = 0; i < this.data.users.length; i++) {
      if (banned_id === this.data.users[i].user_id){
          this.data.banned_users.push(this.data.users[i].user_id);
          this.data.users.splice(i, 1);
          return true
      }
    }
    return false;
  }

  async unBanUser(user_id: number, banned_id: number): Promise<boolean> {
    if (!this.isInChannel(user_id)) return false;
    if (!this.isBanned(banned_id)) return false;
    if (!this.isOwner(user_id)) return false;

    for (let i = 0; i < this.data.banned_users.length; i++) {
      if (banned_id === this.data.banned_users[i]){
          this.data.banned_users.splice(i, 1);
          return true;
      }
    }
    return false;
  }


  async muteUser(user_id: number, muted_id: number): Promise<boolean> {
    if (!this.isInChannel(user_id)) return false;
    if (!this.isInChannel(muted_id)) return false;
    if (this.isOwner(muted_id)) return false;
    if (!this.isOwner(user_id)) return false;

    for (let i = 0; i < this.data.users.length; i++) {
      if (muted_id === this.data.users[i].user_id)
        this.data.users[i].is_muted = true;
    }
    setInterval(() => this.unMuteUser(user_id, muted_id), 10000);
  }



  unMuteUser(user_id: number, unmuted_id: number) {
    if (!this.isInChannel(user_id)) return false;
    if (!this.isOwner(user_id)) return false;
    if (!this.isInChannel(unmuted_id)) return false;

    for (let i = 0; i < this.data.users.length; i++) {
      if (unmuted_id === this.data.users[i].user_id)
        this.data.users[i].is_muted = false;
        return true;
    }
    return false;
  }

  async changePassw(user_id: number ,pass: string): Promise<boolean> {
    if (await this.isOwner(user_id)) {
      this.data.password = pass;
      return true;
    }
    return false;
  }

  async leaveChannel(user_id: number) {
    for (let i = 0; i < this.data.users.length; i++) {
      if (user_id === this.data.users[i].user_id) {
        if (this.data.users[i].is_owner === true){
          for(let j :number = 0; j < this.data.owners.length; j++){
            if (this.data.users[i].user_id === this.data.owners[j]){
                this.data.owners.splice(j, 1);
            }
          }
        }
        this.data.users.splice(i, 1);
      }
    }
    if (this.data.users.length === 0){
      this.data.channel_status = 2;
    }
      else if(this.data.owners.length === 0) {
        this.data.users[0].is_owner = true;
        this.data.owners.push(this.data.users[0].user_id);
      }

  }
}