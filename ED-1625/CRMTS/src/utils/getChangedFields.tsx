import type { UserRequest, Profile } from "../types/types";

export function getChangedFields(
  original: Profile,
  updated: UserRequest
): Partial<UserRequest> {
  const changes: Partial<UserRequest> = {};

  (Object.keys(updated) as (keyof UserRequest)[]).forEach((key) => {
    if (updated[key] !== original[key]) {
      changes[key] = updated[key];
    }
  });

  return changes;
}