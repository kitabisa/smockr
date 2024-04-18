import { execSync } from 'child_process'
import path from 'path'

/**
 * smockr is CLI tools for serve supple mock server
 * with random fake data using Faker.js
 *
 * @usage {cliName} --port 8080
 *
 * @param {number}   [port=8080] define port
 * @param {string}   [secret=""] define secret for client header X-Smockr-Secret
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
  const server = path.resolve(__dirname, '../../bin/server.js')
  execSync(`bun ${server}`, {
      env: {
        PORT: port,
        SECRET_KEY: secret,
        ALLOWED_ORIGIN: allowOrigin,
        ALLOWED_METHODS: allowMethods,
        ALLOWED_HEADERS: allowHeaders
      },
      stdio: 'inherit'
    }
  )
}
