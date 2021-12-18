export type ValidationResultSuccess = {
    success: true;
    errors?: never;
}

export type ValidationResultError = {
    success: false;
    errors: Map<string, string[]>
}

export type ValidationResult = ValidationResultSuccess|ValidationResultError;
