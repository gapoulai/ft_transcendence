import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EventsModule } from "./events/events.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";

import { User } from "./users/entities/user.entity";
import { ChannelsModule } from './channels/channels.module';
import { Channel } from "./channels/entities/channel.entity";
import { Message } from "./channels/entities/message.entity";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot({
            // TODO: Make them configurable.
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "postgres",
            database: "ft_transcendance",

            // TODO: This can destroy production data, so we may want to remove this in the future.
            synchronize: true,

            entities: [
                User,
                Channel,
                Message
            ],
        }),
        EventsModule,
        UsersModule,
        AuthModule,
        ChannelsModule,
        
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
