import { ValidationError } from 'class-validator'
import { ErrorObject, ValidationErrorObject } from './errors.type'

export const ErrorDescriptions = {
  invalid_uuid: {
    description: 'The uuid provided is not a valid uuid',
    status: 400
  },

  missing_parameters: {
    description: 'Missing parameters for required field',
    status: 400
  },

  email_exists: {
    description: 'The email provided already exists',
    status: 409,
    detail: 'The unique key email already exists'
  },

  invalid_token: {
    description: 'The token provided is not valid',
    status: 401
  },

  invalid_credentials: {
    description: 'The credentials provided are invalid',
    status: 401
  },

  not_found: {
    description: 'The resource could not be found',
    status: 404
  },

  missing_scope: {
    description: 'The scope provided is missing or invalid',
    status: 403
  },

  unauthorized: {
    description: 'The user is not authorized to perform this action',
    status: 403
  },

  invalid_parameters: {
    description: 'The parameters provided are invalid',
    status: 400
  },

  email_error: {
    description: 'There was an error sending the email',
    status: 500
  },

  already_exists: {
    description: 'Entity already exists',
    status: 409
  }
}

type CustomErrorType = keyof typeof ErrorDescriptions

export class CustomError extends Error {
  status?: number
  errors?: ValidationError[]
  detail?: string

  constructor () {
    super()

    this.name = ''
    this.status = 400
    this.message = ''
    this.errors = undefined
  }

  withError (error: CustomErrorType): this {
    this.name = error
    this.message = ErrorDescriptions[error].description
    this.status = ErrorDescriptions[error].status
    return this
  }

  withValidationErrors (errors: ValidationError[]): this {
    this.errors = errors
    return this
  }

  withDetail (detail: string): this {
    this.detail = detail
    return this
  }

  withCode (code: number): this {
    this.status = code
    return this
  }

  get object (): ErrorObject {
    return {
      error: this.name,
      error_description: this.message,
      validation: this.validationErrors,
      detail: this.detail
    }
  }

  get validationErrors (): ValidationErrorObject[] | undefined {
    if (this.errors === null || this.errors === undefined) return undefined
    return this.errors.map(error => {
      if (error.constraints === null || error.constraints === undefined) {
        return {
          error: error.property,
          error_description: 'No description given'
        }
      }
      return {
        error: error.property,
        error_description: error.constraints[Object.keys(error.constraints)[0]]
      }
    })
  }
}
