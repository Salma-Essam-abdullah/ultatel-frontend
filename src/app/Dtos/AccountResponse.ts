export interface AccountResponse {
    message: string;
    isSucceeded: boolean;
    errors: {
      [key: string]: string;
    } | null;
  }
  