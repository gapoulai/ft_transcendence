import { Exclude } from "class-transformer"
import { User } from "src/users/entities/user.entity"
import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from "typeorm"

export enum RelationKind {
    FRIEND = "friend",
    BLOCKED = "blocked",
}

@Entity()
export class Relation {
    @PrimaryGeneratedColumn()
    id: number

    @Exclude()
    @ManyToOne(() => User, (user) => user._relations_current)
    current: User

    @RelationId((relation: Relation) => relation.current)
    currentId: User

    @Exclude()
    @ManyToOne(() => User, (user) => user._relations_target)
    target: User

    @RelationId((relation: Relation) => relation.target)
    targetId: User

    @Column({
        type: "enum",
        enum: RelationKind,
    })
    kind: RelationKind
}
