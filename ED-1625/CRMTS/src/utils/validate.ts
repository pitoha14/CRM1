export type ValidationResult = {
  valid: boolean;
  error?: string;
};

export function validateTodoTitle(title: string): ValidationResult {
  const trimmed = title.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: "Задача должна быть минимум 2 символа" };
  }
  if (trimmed.length > 64) {
    return { valid: false, error: "Задача не может быть длиннее 64 символов" };
  }

  return { valid: true };
}