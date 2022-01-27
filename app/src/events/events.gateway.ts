// import { UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Server } from "ws";

// https://docs.nestjs.com/websockets/guards
@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    async handleConnection(@ConnectedSocket() client: Socket) {
        console.log(`client connected: ${client.id}`);
        client.emit("connection");
        client.broadcast.emit("dummy", Date.now().toLocaleString());
        // this.server.emit("error", "pouet");
    }
    async handleDisconnect(@ConnectedSocket() client: Socket) {
        console.log(`client disconnected: ${client.id}`);
    }

    @SubscribeMessage("dummy")
    async dummyEvent(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: number,
    ) {
        console.log(`${client.id}:`, data);
    }
}
