import { InternalType } from "@model/types/constants-config"

export interface WarDrobe{
    uuid: string
    name: string
    address: string
    stock: number
    valueSales: number
    city: InternalType & {
        department: InternalType
    }
    unitSold: number
}