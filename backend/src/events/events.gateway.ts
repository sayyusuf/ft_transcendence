import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit
  } from '@nestjs/websockets';

import { Socket } from 'dgram';
import { connect } from 'http2';

  import { combineLatest, from, Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { Server } from 'socket.io';
  

  @WebSocketGateway({cors: { origin: '*',}})
  export class EventsGateway implements
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit{

    @WebSocketServer()
    server: Server;

    handleDisconnect(client: any) {
      console.log("disconnected");

    }
    handleConnection(client: any, ...args: any[]) {
      console.log("connected = " + client.id);
    }
    afterInit(server: any) {
      console.log("init");
    }

    @SubscribeMessage('PRIV')
    async handleEvent(client: any, data: any): Promise<string> {
    
        let com = JSON.parse(data);
       
        if (com.sender != '' && com.target != '')
        {
          console.log(com)
            this.server.emit(com.target, data);
            return data;
        }
        return undefined;
      }

	  @SubscribeMessage('DM')
	  async handlDirectMessage(client: any, data: any): Promise<any>{
		  const com = JSON.parse(data);
		  
		  if (com.sender != '' && com.target != '')
        {
          	console.log(com)
            this.server.emit(com.target, data);
            return data;
        }
        return undefined;
	  }
  }