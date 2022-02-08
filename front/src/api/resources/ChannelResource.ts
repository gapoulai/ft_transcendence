import { apiurl, BaseResource } from "./BaseResource"

export class ChannelResource extends BaseResource {
	readonly id: number | undefined = undefined
	readonly name: string = ""
	readonly joinable: boolean = false
	readonly has_password: boolean = false

	pk() {
		return this.id?.toString()
	}

	static urlRoot = apiurl("channels")
}
