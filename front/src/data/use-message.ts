import useFetch, { fetcher, useSubmit } from "./use-fetch"

export type Message = {
    id: number
    content: string
    authorId: number
    channelId: number
}

export function useMessages(channelId: number): Message[] {
    // Messages are not immuable but mutate through websocket events, so there's no need to
    // emit request to have fresh data.
    return useFetch(`/channels/${channelId}/messages`, {
        revalidateOnMount: false,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })
}

export type CreateMessageRequest = {
    channelId: number
    content: string
}

export function useCreateMessage() {
    return useSubmit<CreateMessageRequest, Message>(({ channelId, content }) => fetcher(`/channels/${channelId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content })
    }))

}

export type RemoveMessageRequest = {
    channelId: number
    messageId: number
}

export function useRemoveMessage() {
    return useSubmit<RemoveMessageRequest, void>(({ channelId, messageId }) => fetcher(`/channels/${channelId}/messages/${messageId}`, {
        method: 'DELETE'
    }, false))
}
