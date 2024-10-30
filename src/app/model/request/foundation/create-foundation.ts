export interface CreateFoundationRequest{
    name: string
    nit: number
    phone: number
    legalRepresentative: string
    email: string
    typeMeetUsUuid: string
    contactUser: {
        name: string
        last_name: string
        phone: number
        email: string
    }
    clotheBankUuid: string
    cityUuid: string 
}