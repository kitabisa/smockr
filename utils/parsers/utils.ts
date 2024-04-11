export const withRecursive = (z: any, withFunctions: ((z: any) => any)[]) =>
  withFunctions.reduce((z, fn) => fn(z), z)
