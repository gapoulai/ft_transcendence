import { Channel } from "./channel.entity"
import { User } from "src/users/entities/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm"
import { Exclude } from "class-transformer"

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.messages)
    @Exclude()
    author: User

    @RelationId((message: Message) => message.author)
    authorId: number

    @Column()
    content: string

    @ManyToOne(() => Channel, (channel) => channel.messages)
    @Exclude()
    channel: Channel

    @RelationId((message: Message) => message.channel)
    channelId: number
}
