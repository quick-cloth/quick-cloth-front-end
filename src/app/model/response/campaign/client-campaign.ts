import { InternalType } from "@model/types/constants-config"

export interface ClientCampaign{
    uuid: string
    name: string
    message_campaign: string
    creation_date: Date
    end_date: Date
    //clotheBank:
    typeCampaign: InternalType
    typeClothe: InternalType
    typeGender: InternalType
    typeStage: InternalType
    discount: number
}