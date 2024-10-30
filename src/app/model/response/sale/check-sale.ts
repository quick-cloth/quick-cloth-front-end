export interface CheckSaleResponse{
    totalValue: number
    saleList: SaleList[]
    payPointsValue: number
    newPoints: number
    points: 0
}
interface SaleList{
    clothUuid: string
    clotheName: string
    typeGenderName: string
    typeStageName: string
    quantity: number
    value: number
    campaignList: CampaignList[]
}

interface CampaignList{
    uuid: string
    campaignName: string
    description: string
    startDate: Date
    endDate: Date
    discount: number
    valueDiscount: number
}