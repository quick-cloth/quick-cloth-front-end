export interface CreateOrderRequest{
    wardropeUuid: string //TODO fix typo when backend does
    clothes: {
        clotheUuid: string
        quantity: number
    }[]
}