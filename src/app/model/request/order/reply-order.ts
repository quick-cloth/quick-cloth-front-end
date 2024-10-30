export interface ReplyOrderRequest{
    wardropeUuid: string
    clothes: {
        clotheUuid: string
        quantity: number
    }[]
}