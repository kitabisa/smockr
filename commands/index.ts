import { execSync } from 'child_process'
import isValidDomain from 'is-valid-domain'
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
  if (allowOrigin && allowOrigin !== '*') {
    allowOrigin.split(',').map((origin), {
      if (!isValidDomain(origin.trim(), { wildcard: true })) {
        console.error(`${origin.trim()} is not valid domain`)
        return
      }
    })
  }
  if (allowMethods && allowMethods !== '*') {
    const methods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
    allowMethods.split(',').map((method), {
      if (!methods.includes(method.trim().toUpperCase())) {
        console.error(`${method.trim().toUpperCase()} is not valid http method`)
        return
      }
    })
  }
  const server = path.resolve(__dirname, '../../bin/server.js')
  execSync(`bun ${server}`, {
      env: {
        ...process.env,
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
