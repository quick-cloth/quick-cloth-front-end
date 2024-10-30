import { InternalType } from "@model/types/constants-config"

export interface WardrobeInventory{
    uuid: string
    clothe: {
        uuid: string
        typeClothe: InternalType
        typeGender: InternalType
        typeStage: InternalType
    }
    stock: number
    minimumStock: number
}