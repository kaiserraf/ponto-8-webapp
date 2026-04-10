import {HttpResponse} from '../Models/httpModel';

// --- 2xx Success ---
export const ok = async (): Promise<HttpResponse> => {
    return { status: 200, body: null };
}
export const created = async (data: any = null): Promise<HttpResponse> => {
    return { status: 201, body: null };
}

export const noContent = async (): Promise<HttpResponse> => {
    return { status: 204, body: null };
}

// --- 4xx Client Errors ---
export const badRequest = async (): Promise<HttpResponse> => {
    return { status: 400, body: null };
}

export const unauthorized= async (): Promise<HttpResponse> => {
    return { status: 401, body: null };
}

export const forbidden = async (): Promise<HttpResponse> => {
    return { status: 403, body: null };
}

export const notFound = async (): Promise<HttpResponse> => {
    return { status: 404, body: null };
}

export const conflict = async (): Promise<HttpResponse> => {
    return { status: 409, body: null };
}

// --- 5xx Server Errors ---
export const internalServerError = async (error:Error): Promise<HttpResponse> => {
    return { status: 500, body: error };
}