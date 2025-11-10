export function validateTodoTitle(title: string): string | undefined {
  const trimmed = title.trim();

  if (trimmed.length < 2) {
    return "Задача должна быть минимум 2 символа";
  }
  if (trimmed.length > 64) {
    return "Задача не может быть длиннее 64 символов";
  }

  return undefined;
}
