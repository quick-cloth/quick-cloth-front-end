import { CreateWardrobeRequest } from "./create-wardrobe";

export interface UpdateWardrobeRequest extends CreateWardrobeRequest{
    uuid: string
}