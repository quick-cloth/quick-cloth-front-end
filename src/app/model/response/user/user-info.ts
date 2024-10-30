interface BaseUserInfo{
    uuid: string
    name: string
    lastName: string
    email: string
}

type ExclusiveUUID = 
    | {wardRopeUuid: string; clotheBankUuid: null}
    | {wardRopeUuid: null; clotheBankUuid: string}

export type UserInfo = BaseUserInfo & ExclusiveUUID;

//RECIBIDO => EN_CAMINO => ENTREGADO