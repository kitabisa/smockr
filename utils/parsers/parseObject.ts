import type { JSONSchema7 } from "json-schema";
import { z } from "zod";
import { parseSchema } from "./parseSchema";

export const parseObject = (schema: JSONSchema7 & { type: "object" }): any => {

  if (!schema.properties) {
    if (typeof schema.additionalProperties == 'object') {
      return z.record(parseSchema(schema.additionalProperties));
    }
    return z.object({}).catchall(z.any());
  }


  const objectSchema = z.object(
    Object.fromEntries(Object.entries(schema?.properties ?? {}).map(
      ([k, v]) => {
        if (schema.required?.includes(k)) {
          return [k, parseSchema(v)]
        }
        return [k, parseSchema(v).optional()];
      }
    ))
  );

  if (schema.additionalProperties === true) return objectSchema.catchall(z.any());
  if (schema.additionalProperties === false) return objectSchema.strict();
  if (typeof schema.additionalProperties === "object") return objectSchema.catchall(parseSchema(schema.additionalProperties));
  return objectSchema;
};