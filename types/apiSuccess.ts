export type PaginationMeta = {
    total: number;
    count: number;
    limit: number;
    page: number;
    totalPages: number;

    next?: string;   // full url
    prev?: string;   // full url
};

export type ApiSuccess<T> = {
    success: true;
    message?: string;
    data: T;
    meta?: PaginationMeta;
};

export type ApiError = {
    success: false;
    message: string;
    // errors?: any;
};
