import { withRecursive } from "../utils";
import type { JSONSchema7 } from "json-schema";
import { z } from "zod";

export const parseString = (schema: JSONSchema7 & { type: "string" }) => {

  const withPattern = (z: any) => {
    if (schema.pattern) return z.regex(new RegExp(schema.pattern));
    return z;
  }

  const withFormat = (z: any) => {
    switch (schema.format) {
      case 'email': return z.email();
      case 'uri': return z.url();
      case 'uuid': return z.uuid();
      default: return z;
    }
  }

  const withMinLength = (z: any) => {
    if (typeof schema.minLength == 'number') return z.min(schema.minLength);
    return z;
  }
  const withMaxLength = (z: any) => {
    if (typeof schema.maxLength == 'number') return z.max(schema.maxLength);
    return z;
  }

  return withRecursive(z.string(), [withPattern, withFormat, withMinLength, withMaxLength]);
};