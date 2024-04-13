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
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'
const allowedMethods = process.env.ALLOWED_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE'
const allowedHeaders = process.env.ALLOWED_HEADERS
  ? `X-Smockr-Secret,${process.env.ALLOWED_HEADERS}`
  : '*'

const corsOptions = cors({
  origin: allowedOrigin,
  methods: allowedMethods,
  allowedHeaders: allowedHeaders,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
})

app.use(corsOptions)

app.use(express.json())

app.use(morgan('combined'))

app.get('/health-check', (_req: Request, res: Response) => {
  res.send({ health_check: 'up' })
})

app.all('*', (req: Request, res: Response) => {
  const { mock }: any = req.query
  const clientSecret = req.headers['X-Smockr-Secret']
  const body = mock?.response?.body
    ? faker.helpers.fake(mock.response.body)
    : undefined
  const headers = {
    'Content-Type': 'application/json',
    ...(mock?.response?.headers &&
      JSON.parse(mock.response.headers.toString())),
  }
  const status = mock?.response?.status ? Number(mock.response.status) : 200
  const delay = mock?.response?.delay ? Number(mock.response.delay) : 0
  const bodySchema = mock?.request?.body?.schema
    ? JSON.parse(mock.request.body.schema.toString())
    : undefined

  if (secret) {
    if (clientSecret !== secret) {
      res.status(401)
      res.send({
        code: 401,
        message:
          'your secret is unauthorized, please check X-Smockr-Secret header on your request',
      })
      return
    }
  }

  if (
    !mock ||
    status < 200 ||
    status > 599
  ) {
    res.status(422)
    res.send({
      code: 422,
      message:
        'invalid request, read our docs for using mock https://github.com/kitabisa/smockr?tab=readme-ov-file#usage',
    })
    return
  }

  if (bodySchema) {
    const jsonSchema = JSON.parse(bodySchema.toString())
    const validation = validate(req.body, jsonSchema, {
      required: true,
      allowUnknownAttributes: false,
    })

    if (!validation.valid) {
      res.status(400)
      res.send({
        code: 400,
        message: validation.errors[0].message,
      })
      return
    }
  }

  if (delay) {
    setTimeout(() => {
      res.status(status)
      res.set(headers)
      res.send(body)
    }, delay)
    return
  }

  res.status(status)
  res.set(headers)
  res.send(body)
})

app.listen(port, () => {
  console.log(`   \x1b[33m▲ ${pkg.name} ${pkg.version}\x1b[0m`)
  console.log(`   - Environment:`)
  console.log(`     PORT=${port}`)
  console.log(`     SECRET_KEY=${secret ? dev ? secret : '******' : 'undefined'}`)
  console.log(`     ALLOWED_ORIGIN=${allowedOrigin}`)
  console.log(`     ALLOWED_METHODS=${allowedMethods}`)
  console.log(`     ALLOWED_HEADERS=${allowedHeaders}`)
  console.log(`   - Network:      http://localhost:${port}`)
  console.log(`   - Local:        http://0.0.0.0:${port}`)
})
