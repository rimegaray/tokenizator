import {
  IsEmail,
  IsNumberString,
  Length,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as luhn from 'luhn';

@ValidatorConstraint({ name: 'validateCustom' })
export class ValidateYear implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const currentYear = new Date().getFullYear();
    const enteredYear = parseInt(value, 10);
    return (
      !isNaN(enteredYear) &&
      enteredYear >= currentYear &&
      enteredYear <= currentYear + 5
    );
  }
}

@ValidatorConstraint({ name: 'validateCustom' })
export class ValidateCardFormat implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return luhn.validate(value);
  }
}

export class GenerateTokenRequestDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @Length(5, 100, {
    message: 'Email length should be between 5 and 100 characters',
  })
  readonly email: string;

  @IsNumberString({}, { message: 'Card number should be a number' })
  @Length(13, 16, {
    message: 'Card number length should be between 13 and 16 digits',
  })
  @Validate(ValidateCardFormat, {
    message: 'Card number should be in Luhn format',
  })
  readonly card_number: string;

  @IsNumberString({}, { message: 'CVV should be a number' })
  @Length(3, 4, { message: 'CVV length should be between 3 and 4 digits' })
  readonly cvv: string;

  @IsNumberString({}, { message: 'Expiration year should be a number' })
  @Length(4, 4, { message: 'Expiration year length should be 4 digits' })
  @Validate(ValidateYear, {
    message: 'Expiration date must be within 5 years from the current date',
  })
  readonly expiration_year: string;

  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'Invalid expiration month' })
  readonly expiration_month: string;
}
