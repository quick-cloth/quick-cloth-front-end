export interface UserDetails{
    username: string
    token: string
    role: USER_TYPE
    uuid: string
    placeUuid: string
    email: string
}

export type USER_TYPE = 'ROLE_BANK_EMPLOYEE' | 'ROLE_WARDROBE_EMPLOYEE' | 'ROLE_CLIENT'
