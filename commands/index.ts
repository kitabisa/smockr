import { execSync } from 'child_process'
import path from 'path'

/**
 * Smockr is CLI Tools for serve supple mock server
 * with random fake data using faker.js
 *
 * @usage {cliName} --port 3000 --secret "yoursecret"
 *
 * @param {number}   [port=3000] define port
 * @param {string}   [secret=""] define secret
 * @param {string}   [allowOrigin="*"] define allow cors origin
 * @param {string}   [allowMethods="GET,POST,PATCH,PUT,DELETE"] define allow cors methods
 * @param {string}   [allowHeaders="*"] define allow cors headers
 */
export default async function main(
  port?: number,
  secret?: string,
  allowOrigin?: string,
  allowMethods?: string,
  allowHeaders?: string,
) {
  const server = path.resolve(__dirname, '../../.next/standalone/server.js')
  
  execSync(`
    PORT=${port} \
    SECRET_KEY=${secret} \
    ALLOWED_ORIGIN=${allowOrigin} \
    ALLOWED_METHODS=${allowMethods} \
    ALLOWED_HEADERS=${allowHeaders} \
    node ${server}
  `, { stdio: 'inherit' })
}