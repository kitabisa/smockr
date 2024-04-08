export const withRecursive = (z: any, withFunctions: ((z: any) => any)[]) => {
  return withFunctions.reduce((z, fn) => {
    return fn(z);
  }, z);
}