import { parseSchema } from '@/utils/parsers/parseSchema'
import { faker } from '@faker-js/faker'
import { type NextRequest } from 'next/server'
import { setTimeout } from 'timers/promises'

async function smockerHandler(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const { searchParams } = new URL(request.url)

  if (requestHeaders.get('X-Smocker-Secret') !== process.env.SMOCKER_SECRET_KEY) {
    return Response.json({ message: 'your secret key is missing or not allowed' }, {
      status: 403,
    })
  }

  if (searchParams.get('smocker[request][body][schema]')) {
    let reqBody

    try {
      reqBody = await request.json()
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

    const reqBodySchema = searchParams.get('smocker[request][body][schema]') || ''
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

  const body = searchParams.get('smocker[response][body]')
    ? faker.helpers.fake(searchParams.get('smocker[response][body]') || '')
    : undefined
  const status = searchParams.get('smocker[response][status]')
    ? Number(searchParams.get('smocker[response][status]'))
    : 200
  const headers = {
    'Content-Type': 'application/json',
    ...(searchParams.get('smocker[response][headers]') &&
      JSON.parse(searchParams.get('smocker[response][headers]') || '')
    ),
  }
  const delay = searchParams.get('smocker[response][delay]')
    ? Number(searchParams.get('smocker[response][delay]'))
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
  smockerHandler
}
