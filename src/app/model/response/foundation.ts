import { InternalType } from "@model/types/constants-config"

export interface Foundation{
    uuid: string
    name: string
    nit: number
    phone: number
    typeMeetUs: InternalType
    contactUser: {
        uuid: string
        name: string
        last_name: string
        phone: number
        email: string
    }
    city: InternalType & {
        department: InternalType
    }
}