export interface CreateDonationRequest{
    userUuid: string
    clotheBankUuid: string
    clothesDonation: {
        typeClotheUuid: string
        typeGenderUuid: string
        typeStageUuid: string
        quantity: number
    }[]
}