import { AbstractControl, ValidationErrors } from '@angular/forms';
export function dateArrayLengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value
    if (Array.isArray(value) && value[0] !== null && value[1] !== null) {
        return null
    }
    return { arrayDates: { requiredDates: 2, actualDates: null } }
}
