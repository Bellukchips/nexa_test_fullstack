export interface ApiResponse<T> {
    data: T;
    meta: {
        status: string;
        code: number;
        message: string;
    };
}
