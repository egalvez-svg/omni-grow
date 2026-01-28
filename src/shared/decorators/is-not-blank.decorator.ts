import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator'

export function IsNotBlank(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsNotBlank',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments): boolean {
          return typeof value === 'string' && value.trim().length > 0
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} should not be empty or whitespace`
        }
      }
    })
  }
}
