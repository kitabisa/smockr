import type { JSONSchema7 } from "json-schema";
import { z } from "zod";
import { parseSchema } from "./parseSchema";

export const parseArray = (schema: JSONSchema7 & { type: "array" }): any => {

  const withMinItems = (z: any) => typeof schema.minItems == 'number' ? z.min(schema.minItems) : z; 
  const withMaxItems = (z: any) => typeof schema.maxItems == 'number' ? z.min(schema.maxItems) : z;

  const wrapper = (z: any) => {
    return withMinItems(withMaxItems(z));
  }

  if (!schema.items) {
    return wrapper(z.array(z.any()));
  }

  if (Array.isArray(schema.items)) {
    return wrapper(z.tuple(schema.items.map(e => parseSchema(e)) as any) as any);
  }

  return wrapper(z.array(parseSchema(schema.items)));
};