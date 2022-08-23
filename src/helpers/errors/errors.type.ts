export interface ValidationErrorObject {
  error: string
  error_description: string | undefined
}

export interface ErrorObject {
  error: string
  error_description: string
  validation?: ValidationErrorObject[]
  detail?: string
}
