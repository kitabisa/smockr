import { parseSchema } from '@/utils/parsers/parseSchema'
import { faker } from '@faker-js/faker'
import cors from 'cors'
import express, { Request, Response } from 'express'
import pjson from './package.json'

const app = express()
const port = process.env.PORT || 8080

const corsOptions = cors({
  origin: process.env.ALLOWED_ORIGIN,
  methods: process.env.ALLOWED_METHODS,
  allowedHeaders: process.env.ALLOWED_HEADERS,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
})

app.use(corsOptions)

app.use(express.json())

app.all("*", (req: Request, res: Response) => {
  const appSecretKey = process.env.SECRET_KEY || ''
  const secretKey = req.headers['X-Smockr-Secret'] || ''
  const bodySchema = req.query['mock[request][body][schema]']
    ? JSON.parse(req.query['mock[request][body][schema]'].toString())
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

  const body = req.query['mock[response][body]']
    ? faker.helpers.fake(req.query['mock[response][body]'].toString())
    : undefined
  const headers = {
    'Content-Type': 'application/json',
    ...(req.query['mock[response][headers]'] &&
      JSON.parse(req.query['mock[response][headers]'].toString())
    ),
  }
  const status = req.query['mock[response][status]']
    ? Number(req.query['mock[response][status]'])
    : 200
  const delay = req.query['mock[response][delay]']
    ? Number(req.query['mock[response][delay]'])
    : 0

  setTimeout((() => {
    res.status(status)
    res.set(headers)
    res.send(body)
  }), delay)
})

app.listen(port, () => {
  console.log(`   \x1b[33m▲ smockr ${pjson.version}\x1b[0m`)
  console.log(`   - Network:      http://localhost:${port}`)
  console.log(`   - Local:        http://0.0.0.0:${port}`)
})