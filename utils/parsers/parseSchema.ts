import type { JSONSchema7, JSONSchema7Type } from "json-schema";
import { z, ZodType } from "zod";
import { parseArray } from "./parseArray";
import { parseBoolean } from "./parseBoolean";
import { parseEnum } from "./parseEnum";
import { parseNumber } from "./parseNumber";
import { parseObject } from "./parseObject";
import { parseString } from "./parseString";

// https://github.com/StefanTerdell/json-schema-to-zod

export const parseSchema = (schema: JSONSchema7 | boolean, useAnyFallback?: boolean) => {
  if (typeof schema !== "object") {
    throw new Error(`Invalid schema: ${schema}`);
  }

  const parser = parsers.find(e => e.test(schema));
  if (!parser) {
    if (useAnyFallback) return z.any();
    throw new Error(`Schema parsing not supported for '${schema.type}'`);
  }
  return withMeta(parser.parse(schema as any), schema);
};

const withMeta = (z: ZodType, schema: JSONSchema7) => {
  if (schema.description) {
    return z.describe(JSON.stringify(schema.description));
  }
  return z;
};


const primitiveTest = <T extends "string" | "number" | "integer" | "boolean" | "null">(p: T[]) => (x: JSONSchema7): x is JSONSchema7 & { type: T } => p.includes(x.type as any);

const parsers = [{
  test: (x: JSONSchema7): x is JSONSchema7 & { type: "object" } => x.type === "object",
  parse: parseObject,
}, {
  test: (x: JSONSchema7): x is JSONSchema7 & { type: "array" } => x.type === "array",
  parse: parseArray,
}, {
  test: (x: JSONSchema7): x is JSONSchema7 & { enum: JSONSchema7Type | JSONSchema7Type[]; } => !!x.enum,
  parse: parseEnum,
}, {
  test: primitiveTest(['number', 'integer']),
  parse: parseNumber,
}, {
  test: primitiveTest(['string']),
  parse: parseString,
}, {
  test: primitiveTest(['boolean']),
  parse: parseBoolean,
}];
