import { parseSchema } from '@/utils/parsers/parseSchema'
import { faker } from '@faker-js/faker'
import { type NextRequest } from 'next/server'
import { setTimeout } from 'timers/promises'

const SECRET_KEY = `${process.env.SECRET_KEY}`

async function smockrHandler(req: NextRequest) {
  const reqHeaders = new Headers(req.headers)
  const { searchParams } = new URL(req.url)

  if (SECRET_KEY && reqHeaders.get('X-Smockr-Secret') !== SECRET_KEY) {
    return Response.json({ message: 'your secret key is missing or not allowed' }, {
      status: 403,
    })
  }

  if (searchParams.get('mock[request][body][schema]')) {
    let reqBody

    try {
      reqBody = await req.json()
    } catch(error) {
      return Response.json({
        response_code: "00001",
        response_desc: {
          id: 'bad request',
          en: 'bad request',
        }
      }, {
        status: 400,
      })
    }

    const reqBodySchema = searchParams.get('mock[request][body][schema]') || ''
    const jsonSchema = JSON.parse(reqBodySchema)
    const zodSchema = parseSchema(jsonSchema)
    const validation = zodSchema.safeParse(reqBody)
    
    if (!validation.success) {
      const message = `${validation.error.errors[0].path[0]} ${validation.error.errors[0].message}`
      return Response.json({
        response_code: "00001",
        response_desc: {
          id: message.toLocaleLowerCase(),
          en: message.toLocaleLowerCase(),
        }
      }, {
        status: 400,
      })
    }
  }

  const body = searchParams.get('mock[response][body]')
    ? faker.helpers.fake(searchParams.get('mock[response][body]') || '')
    : undefined
  const status = searchParams.get('mock[response][status]')
    ? Number(searchParams.get('mock[response][status]'))
    : 200
  const headers = {
    'Content-Type': 'application/json',
    ...(searchParams.get('mock[response][headers]') &&
      JSON.parse(searchParams.get('mock[response][headers]') || '')
    ),
  }
  const delay = searchParams.get('mock[response][delay]')
    ? Number(searchParams.get('mock[response][delay]'))
    : 0

  if (delay) {
    await setTimeout(delay)
  }

  return new Response(body, {
    status,
    headers,
  })
}

export {
  smockrHandler
}
