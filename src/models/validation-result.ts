export interface ValidationResult {
    success: boolean;
    errors?: Map<string, string[]>
}
