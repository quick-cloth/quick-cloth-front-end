export interface ClientSale{
    uuid: string
    saleDate: Date
    value: number
    payPoints: number
    wardrobe: {
        name: string
        address: string
        city:{
            name: string
        }
    }
    earnedPoints: number
}