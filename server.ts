import { parseSchema } from '@/utils/parsers/parseSchema'
import { faker } from '@faker-js/faker'
import cors from 'cors'
import express, { Request, Response } from 'express'
import pkg from './package.json'

const app = express()
const port = process.env.PORT || 8080

const corsOptions = cors({
  origin: process.env.ALLOWED_ORIGIN,
  methods: process.env.ALLOWED_METHODS,
  allowedHeaders: process.env.ALLOWED_HEADERS
    ? `X-Smocker-Secret,${process.env.ALLOWED_HEADERS}`
    : '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
})

app.use(corsOptions)

app.use(express.json())

app.all('*', (req: Request, res: Response) => {
  const { mock }: any = req.query
  const appSecretKey = process.env.SECRET_KEY || ''
  const secretKey = req.headers['X-Smocker-Secret'] || ''
  const bodySchema = mock?.request?.body?.schema
    ? JSON.parse(mock.request.body.schema.toString())
    : undefined
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

  if (appSecretKey) {
    if (secretKey !== appSecretKey) {
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
    (!body && req.method === 'GET') ||
    status < 100 ||
    status > 599 ||
    (bodySchema && !['PUT', 'POST', 'PATCH'].includes(req.method))
  ) {
    res.status(422)
    res.send({
      code: 422,
      message:
        'invalid mock params, read our docs on https://github.com/kitabisa/smockr?tab=readme-ov-file#usage',
    })
    return
  }

  if (bodySchema) {
    const jsonSchema = JSON.parse(bodySchema.toString())
    const zodSchema = parseSchema(jsonSchema)
    const validation = zodSchema.safeParse(req.body)

    if (!validation.success) {
      res.status(400)
      res.send({
        code: 400,
        message: `${validation.error.errors[0].path[0]} ${validation.error.errors[0].message.toLocaleLowerCase()}`,
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
  console.log(`   - Network:      http://localhost:${port}`)
  console.log(`   - Local:        http://0.0.0.0:${port}`)
})
