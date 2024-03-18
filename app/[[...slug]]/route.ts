import { type NextRequest } from 'next/server'
import { setTimeout } from 'timers/promises'
import { faker } from '@faker-js/faker'

export async function GET(request: NextRequest) {
  return smocker(request)
}

export async function POST(request: NextRequest) {
  return smocker(request)
}

export async function PATCH(request: NextRequest) {
  return smocker(request)
}

export async function PUT(request: NextRequest) {
  return smocker(request)
}

export async function DELETE(request: NextRequest) {
  return smocker(request)
}

async function smocker(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const body = requestHeaders.get('X-Smocker-Body')
    ? faker.helpers.fake(`${requestHeaders.get('X-Smocker-Body')}`)
    : undefined
  const status = requestHeaders.get('X-Smocker-Status')
    ? Number(requestHeaders.get('X-Smocker-Status'))
    : 200
  const headers = requestHeaders.get('X-Smocker-Headers')
    ? JSON.parse(`${requestHeaders.get('X-Smocker-Headers')}`)
    : undefined
  const delay = requestHeaders.get('X-Smocker-Delay')
    ? Number(requestHeaders.get('X-Smocker-Delay'))
    : 0

  if (delay) {
    await setTimeout(delay)
  }

  return new Response(body, {
    status,
    headers,
  })
}
