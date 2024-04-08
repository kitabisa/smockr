import type { JSONSchema7 } from "json-schema";
import { z } from "zod";

export const parseBoolean = (schema: JSONSchema7 & { type: "boolean"; }) => {
  return z.boolean();
};