export type ApiErrorResponse = {
  status: "error";
  message?: string;
  error?: unknown;
  [key: string]: unknown;
};

export type ApiSuccessResponse = {
  status: "success";
  [key: string]: unknown;
};

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export interface ApiResponseWriter<
  SuccessResponse extends ApiSuccessResponse = ApiSuccessResponse,
> {
  json(body: SuccessResponse | ApiErrorResponse): void;
  status(code: number): ApiResponseWriter<SuccessResponse>;
  set(field: string, value: string): ApiResponseWriter<SuccessResponse>;
}
