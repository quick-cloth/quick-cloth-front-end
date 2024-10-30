export interface WardrobeSale{
    uuid: string
    date: Date
    quantity: number
    price: string
    payPoints: number
}

export interface WardrobeSaleList extends WardrobeSale{
    saleList: Sale[]
}

interface Sale{
    clotheName: string,
    typeGenderName: string
    typeStageName: string
    quantity: number
    value: string
}