type ErrorType = "info" | "error";

export type Error = {
  message: string;
  type: ErrorType;
};
