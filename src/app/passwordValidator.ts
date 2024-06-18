import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    
    const hasNonAlphanumeric = /[^\w\s]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasUppercase = /[A-Z]/.test(value);

    const passwordValid = hasNonAlphanumeric && hasDigit && hasUppercase;

    return !passwordValid ? { passwordStrength: true } : null;
  };
}
