import type { UserRequest, Profile } from "../types/types";

export function getChangedFields<T extends object>(
  original: T,
  updated: Partial<T>
): Partial<T> {
  const changes: Partial<T> = {};

  (Object.keys(updated) as (keyof T)[]).forEach((key) => {
    const newValue = updated[key] ?? null;
    const oldValue = original[key] ?? null;

    if (newValue !== oldValue) {
      changes[key] = updated[key];
    }
  });

  return changes;
}