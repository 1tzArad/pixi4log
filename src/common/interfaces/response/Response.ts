import {Errors} from "../../enums/Errors";

export interface Response{
    status: 'success' | 'error' | 'failed';
    message?: string;
    error?:{
        type: Errors;
        message: string
    };
    [key: string]: unknown
}