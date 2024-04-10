import { execSync } from 'child_process'

/**
 * ktbs-smocker is CLI tools for serve supple mock server
 * with random fake data using faker.js
 *
 * @usage {cliName} --port 8080 --secret "yoursecret"
 *
 * @param {number}   [port=8080] define port
 * @param {string}   [secret=""] define secret
 * @param {string}   [allowOrigin="*"] define allow cors origin
 * @param {string}   [allowMethods="GET,HEAD,PUT,PATCH,POST,DELETE"] define allow cors methods
 * @param {string}   [allowHeaders="*"] define allow cors headers
 */
export default async function main(
  port?: number,
  secret?: string,
  allowOrigin?: string,
  allowMethods?: string,
  allowHeaders?: string,
) {
  execSync(`
    PORT=${port} \
    SECRET_KEY=${secret} \
    ALLOWED_ORIGIN=${allowOrigin} \
    ALLOWED_METHODS=${allowMethods} \
    ALLOWED_HEADERS=${allowHeaders} \
    bun run start
  `, { stdio: 'inherit' })
}
