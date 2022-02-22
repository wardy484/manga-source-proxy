import { IRequest } from "../types/Data";

export const buildRequest = (url: string): IRequest => {
    return {
        url
    };
}