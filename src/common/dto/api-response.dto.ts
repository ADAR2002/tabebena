export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;

  constructor(partial: Partial<ApiResponse<T>>) {
    Object.assign(this, partial);
  }
}
