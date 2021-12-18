import {immerable} from "immer"
import { ValidationResult } from './validation-result';
import * as yup from 'yup';

export class Model {
    [immerable] = true;

    validate(): ValidationResult {
        try {
            const validations = (this.constructor as any).validations as yup.ObjectSchema<any, never>;
            validations.validateSync(this, {
                strict: true,
                abortEarly: false,
                recursive: true,
            });
            return { success: true };
        } catch(e) {
            const validationError = e as yup.ValidationError;
            const errorMap = new Map(validationError.inner.map((err) => {
                return [err.params?.path as string, err.errors];
            }));

            return {
                success: false,
                errors: errorMap,
            }
        }
    }
}
