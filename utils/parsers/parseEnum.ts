import type { JSONSchema7, JSONSchema7Type } from "json-schema";
import { z } from "zod";

export const parseEnum = (
  schema: JSONSchema7 & { enum: JSONSchema7Type[] | JSONSchema7Type }
) => {

  if (Array.isArray(schema.enum)) {
    if (schema.enum.every(e => typeof e == 'string')) {
      return z.enum(schema.enum as any);
    }
    return z.union(schema.enum.map(e => z.literal(JSON.stringify(e))) as any);
  }
  return z.literal(JSON.stringify(schema.enum));
};