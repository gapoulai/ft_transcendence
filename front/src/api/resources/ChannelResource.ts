import { Resource } from "@rest-hooks/rest"
import { apiurl, BaseResource } from "./BaseResource"

export class ChannelResource extends BaseResource {
	readonly id: number = 0
	readonly name: string = ""
	readonly joinable: boolean = false
	readonly has_password: boolean = false

	pk() {
		return this.id.toString()
	}

	static urlRoot = apiurl("channels")

	static joined<T extends typeof Resource>(this: T) {
		return super.list().extend({
			url() {
				return apiurl("user/channels")
			},
			schema: [this]
		})
	}
}