import useFetch, { fetcher, useSubmit } from "./use-fetch"

export type Membership = {
    id: number
    role: string
    channelId: number
    userId: number
}

export function useMembers(channelId: number): Membership[] {
    return useFetch(`/channels/${channelId}/members`)
}

export function useMember(channelId: number, userId: number): Membership | null {
    const members = useMembers(channelId)

    return members.find((member) => member.userId === userId)
}

export type RemoveMemberRequest = {
    id: number,
    channelId: number
}

export function useRemoveMember() {
    return useSubmit<RemoveMemberRequest, Membership>(({ id, channelId }) => fetcher(`/channels/${channelId}/members/${id}`, {
        method: 'DELETE',
    }, false))
}
