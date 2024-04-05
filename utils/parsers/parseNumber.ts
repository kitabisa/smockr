import { withRecursive } from "../utils";
import type { JSONSchema7 } from "json-schema";
import { z } from "zod";

export const parseNumber = (
  schema: JSONSchema7 & { type: "number" | "integer" }
) => {

  const withInt = (z: any) => {
    if (
      schema.format === "int64" ||
      schema.multipleOf === 1 ||
      schema.type === "integer"
    ) {
      return z.int();
    }
    return z;
  }

  const withMultipleOf = (z: any) => {
    if (typeof schema.multipleOf === "number" && schema.multipleOf !== 1) {
      return z.multipleOf(schema.multipleOf);
    }
    return z;
  }

  const withMinimum = (z: any) => {

    if (typeof schema.minimum === "number") {
      if ((schema as any).exclusiveMinimum === true) {
        return z.gt(schema.minimum);
      }
      return z.gte(schema.minimum);
    }
    
    if (typeof schema.exclusiveMinimum === "number") {
      return z.gt(schema.exclusiveMinimum);
    }
    
    return z;
  }

  const withMaximum = (z: any) => {

    if (typeof schema.maximum === "number") {
      if ((schema as any).exclusiveMaximum === true) {
        return z.lt(schema.maximum);
      }
      return z.lte(schema.maximum);
    }
    
    if (typeof schema.exclusiveMaximum === "number") {
      return z.lt(schema.exclusiveMaximum);
    }

    return z;
  }


  return withRecursive(z.number(), [withInt, withMultipleOf, withMinimum, withMaximum]);
};