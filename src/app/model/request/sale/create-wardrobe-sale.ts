export interface CreateWardrobeSaleRequest{
    wardRopeUuid: string
    userUuid: string
    saleList: SaleList[]
}

interface SaleList{
    value: number
    clotheUuid: string
    quantity: number
}