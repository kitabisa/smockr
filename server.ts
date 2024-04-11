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
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
})

app.use(corsOptions)

app.use(express.json())

app.all('/favicon.ico', (_req, res) => res.status(204))

app.all("*", (req: Request, res: Response) => {
  const mock: any = req.query.mock
  const appSecretKey = process.env.SECRET_KEY || ''
  const secretKey = req.headers['X-Smocker-Secret'] || ''
  const bodySchema = mock?.request?.body?.schema
    ? JSON.parse(mock.request.body.schema.toString())
    : undefined

  if (appSecretKey) {
    if (secretKey !== appSecretKey) {
      res.status(403)
      res.send({ message: 'your secret is missing or wrong' })
      return
    }
  }

  if (bodySchema) {
    const jsonSchema = JSON.parse(bodySchema.toString())
    const zodSchema = parseSchema(jsonSchema)
    const validation = zodSchema.safeParse(req.body)

    if (!validation.success) {
      const message = `${validation.error.errors[0].path[0]} ${validation.error.errors[0].message}`
      res.status(400)
      res.send({
        response_code: "00001",
        response_desc: {
          id: message.toLocaleLowerCase(),
          en: message.toLocaleLowerCase(),
        }
      })
      return
    }
  }
  
  const body = mock?.response?.body
    ? faker.helpers.fake(mock.response.body)
    : undefined
  const headers = {
    'Content-Type': 'application/json',
    ...(mock?.response?.headers &&
      JSON.parse(mock.response.headers.toString())
    ),
  }
  const status = mock?.response?.status
    ? Number(mock.response.status)
    : 200
  const delay = mock?.response?.delay
    ? Number(mock.response.delay)
    : 0

  setTimeout((() => {
    res.status(status)
    res.set(headers)
    res.send(body)
  }), delay)
})

app.listen(port, () => {
  console.log(`   \x1b[33m▲ ${pkg.name} ${pkg.version}\x1b[0m`)
  console.log(`   - Network:      http://localhost:${port}`)
  console.log(`   - Local:        http://0.0.0.0:${port}`)
})
