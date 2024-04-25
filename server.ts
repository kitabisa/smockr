import { faker } from '@faker-js/faker'
import cors from 'cors'
import express, { Request, Response } from 'express'
import { validate } from 'jsonschema'
import morgan from 'morgan'
import pkg from './package.json'

const app = express()
const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 8080
const secret = process.env.SECRET_KEY || ''
const allowOrigin =
  process.env.ALLOWED_ORIGIN && process.env.ALLOWED_ORIGIN !== '*'
    ? process.env.ALLOWED_ORIGIN.replaceAll(' ', '').split(',').join(', ')
    : '*'
const allowMethods =
  process.env.ALLOWED_METHODS && process.env.ALLOWED_METHODS !== '*'
    ? process.env.ALLOWED_METHODS.replaceAll(' ', '')
        .split(',')
        .join(', ')
        .toUpperCase()
    : '*'
const allowHeaders =
  process.env.ALLOWED_HEADERS && process.env.ALLOWED_HEADERS !== '*'
    ? `${process.env.ALLOWED_HEADERS?.replaceAll(' ', '').split(',').join(', ')}, X-Smockr-Secret`
    : '*'

const corsOptions = cors({
  origin: allowOrigin,
  methods: allowMethods,
  allowedHeaders: allowHeaders,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
})

app.use(corsOptions)

app.use(express.json())

app.use(
  morgan('combined', {
    skip: function (req, _res) {
      return req.url === '/favicon.ico'
    },
  }),
)

app.get('/health-check', (_req: Request, res: Response) => {
  res.send({ health_check: 'up' })
})

app.get('/favicon.ico', (_req: Request, res: Response) => {
  res.status(204)
})

app.all('*', (req: Request, res: Response) => {
  const clientSecret = req.headers['x-smockr-secret']
  const { mock }: any = req.query
  let body = mock?.response?.body
  let headers = mock?.response?.headers
  let status = mock?.response?.status
  let delay = mock?.response?.delay
  let bodySchema = mock?.request?.body?.schema

  if (secret) {
    if (clientSecret !== secret) {
      res.status(401)
      res.send({
        code: 401,
        message:
          'Your secret is unauthorized, please check X-Smockr-Secret header on your request.',
        type: 'AuthException',
      })
      return
    }
  }

  if (!body && !headers && !status && !delay && !bodySchema) {
    res.status(422)
    res.send({
      code: 422,
      message:
        'Invalid mock, read our docs for using mock https://github.com/kitabisa/smockr?tab=readme-ov-file#usage.',
      type: 'MockSearchParamsException',
    })
    return
  }

  if (body) {
    try {
      body = faker.helpers.fake(body)
    } catch (error: any) {
      res.status(422)
      res.send({
        code: 422,
        message: error.message,
        type: 'FakerHelperException',
      })
      return
    }
  }

  if (headers) {
    try {
      headers = {
        'Content-Type': 'application/json',
        ...JSON.parse(headers),
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': allowMethods,
        'Access-Control-Allow-Headers': allowHeaders,
        'X-Powered-By': 'Smockr',
      }
    } catch (_error: any) {
      res.status(422)
      res.send({
        code: 422,
        message:
          'Mock response headers is not valid JSON string, read our docs for using mock https://github.com/kitabisa/smockr?tab=readme-ov-file#usage.',
        type: 'MockSearchParamsException',
      })
      return
    }
  } else {
    headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': allowMethods,
      'Access-Control-Allow-Headers': allowHeaders,
      'X-Powered-By': 'Smockr',
    }
  }

  if (status) {
    if (
      !isNaN(Number(status)) &&
      Number(status) >= 200 &&
      Number(status) <= 599
    ) {
      status = Number(status)
    } else {
      res.status(422)
      res.send({
        code: 422,
        message:
          'Mock response status is not valid HTTP status code, read our docs for using mock https://github.com/kitabisa/smockr?tab=readme-ov-file#usage.',
        type: 'MockSearchParamsException',
      })
      return
    }
  } else {
    status = 200
  }

  if (delay) {
    if (!isNaN(Number(delay))) {
      delay = Number(delay)
    } else {
      res.status(422)
      res.send({
        code: 422,
        message:
          'Mock response delay is not valid number, read our docs for using mock https://github.com/kitabisa/smockr?tab=readme-ov-file#usage.',
        type: 'MockSearchParamsException',
      })
      return
    }
  } else {
    delay = 0
  }

  if (bodySchema) {
    try {
      bodySchema = JSON.parse(bodySchema)
    } catch (_error: any) {
      res.status(422)
      res.send({
        code: 422,
        message:
          'Mock request body schema is not valid JSON schema validation string, read our docs for using mock https://github.com/kitabisa/smockr?tab=readme-ov-file#usage.',
        type: 'MockSearchParamsException',
      })
      return
    }
    try {
      const validation = validate(req.body, bodySchema, {
        required: true,
        allowUnknownAttributes: false,
      })
      if (!validation.valid) {
        const msg = validation.errors[0]
          .toString()
          .replaceAll('instance ', '')
          .replaceAll('instance.', '')
          .replaceAll('"', '')
        res.status(400)
        res.send({
          // nosemgrep
          code: 400,
          message: msg && msg[0].toUpperCase() + msg.slice(1),
          type: 'SchemaValidationException',
        })
        return
      }
    } catch (error: any) {
      res.status(422)
      res.send({
        code: 422,
        message: error.message,
        type: 'JSONSchemaHelperException',
      })
      return
    }
  }

  if (delay) {
    setTimeout(() => {
      res.status(status)
      res.set(headers)
      res.send(body) // nosemgrep
    }, delay)
    return
  }

  res.status(status)
  res.set(headers)
  res.send(body) // nosemgrep
})

app.listen(port, () => {
  console.log(`   \x1b[33m▲ ${pkg.name} ${pkg.version}\x1b[0m`)
  console.log(`   - Network:      http://localhost:${port}`)
  console.log(`   - Local:        http://0.0.0.0:${port}`)
  console.log(`   - Params:       --port ${port}`)
  if (secret)
    console.log(`                   --secret ${dev ? secret : '******'}`)
  console.log(`                   --allowOrigin ${allowOrigin}`)
  console.log(`                   --allowMethods ${allowMethods}`)
  console.log(`                   --allowHeaders ${allowHeaders}\n`)
})
