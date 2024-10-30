import { CreateFoundationRequest } from "./create-foundation";

export interface UpdateFoundationRequest extends CreateFoundationRequest{
    uuid: string
    contactUser: CreateFoundationRequest['contactUser'] &{
        uuid: string
    }
}