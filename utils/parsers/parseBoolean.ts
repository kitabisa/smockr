import type { JSONSchema7 } from 'json-schema'
import { z } from 'zod'

export const parseBoolean = (_schema: JSONSchema7 & { type: 'boolean' }) =>
  z.boolean()
