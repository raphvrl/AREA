export interface AuthError {
  field?: string;
  message: string;
}

export interface ApiValidationError {
  errors?: {
    param: string;
    msg: string;
  }[];
  message?: string;
}
