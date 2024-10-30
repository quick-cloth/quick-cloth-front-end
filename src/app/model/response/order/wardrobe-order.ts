import { InternalType } from "@model/types/constants-config"

export interface WardrobeOrder{
    uuid: string
    wardrobeUuid: string
    orderDate: Date
    orderState: string
    orderValue: number
    deliveryValue: number
    orderList: {
        clothe: {
            uuid: string
            typeClothe: InternalType
            typeGender: InternalType
            typeStage: InternalType
        }
        orderValue: number
        deliveryValue: number
    }[]
}