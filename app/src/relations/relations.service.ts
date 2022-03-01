import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { instanceToPlain } from "class-transformer";
import { SocketsService } from "src/sockets/sockets.service";
import { User } from "src/users/entities/user.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { Relation, RelationKind } from "./relation.entity";

@Injectable()
export class RelationsService {
    constructor(
        @InjectRepository(Relation) private readonly repository: Repository<Relation>,
        private sockets: SocketsService
    ) {

    }

    async get(options: FindOneOptions<Relation>) {
        return this.repository.findOne(options)
    }

    async find(options: FindManyOptions<Relation>) {
        return this.repository.find(options)
    }

    async create(currentUserId: number, targetUserId: number, kind: RelationKind) {
        let relation = new Relation()
        relation.current = { id: currentUserId } as User
        relation.target = { id: targetUserId } as User
        relation.kind = kind

        relation = await this.repository.save(relation)        
        this.publish("created", instanceToPlain(relation, {}))
        return relation
    }

    async remove(relation: Relation) {
        const id = relation.id
        await this.repository.remove(relation)
        this.publish("removed", {
            id,
            currentId: relation.currentId,
            targetId: relation.targetId
        })
    }

    private publish(event: string, data: any) {
        this.sockets.publish([`users.${data.currentId}`, `users.${data.targetId}`], `relations.${event}`, data)
    }
}