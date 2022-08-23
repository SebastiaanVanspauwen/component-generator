/* eslint-disable @typescript-eslint/no-explicit-any */
import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { CustomError } from './errors/errors'

export abstract class DTO {
  static async validate<T extends DTO> (object: T, partial: Partial<T>): Promise<T> {
    const user = Object.assign(object, partial) as T

    const errors = await validate(user, { whitelist: true, forbidNonWhitelisted: true })

    if (errors.length > 0) {
      throw new CustomError()
        .withError('invalid_parameters')
        .withValidationErrors(errors)
    }

    return user
  }

  static async factory<T extends DTO> (Class: new() => T, partial: Partial<T>): Promise<T> {
    const dto = Object.assign(new Class(), partial)

    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true })

    if (errors.length > 0) {
      throw new CustomError()
        .withError('invalid_parameters')
        .withValidationErrors(errors)
    }

    return dto
  }
}

export function DTOBody<T extends DTO> (Class: new() => T) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (req: Request, res: Response) {
      const dto = await DTO.validate(new Class(), req.body)

      req.dto = dto

      return originalMethod(req, res)
    }
  }
}
