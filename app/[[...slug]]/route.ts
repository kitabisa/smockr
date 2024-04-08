import { type NextRequest } from 'next/server'
import { smockrHandler } from '@/utils/handlers/smockr'

export async function GET(req: NextRequest) {
  return smockrHandler(req)
}

export async function POST(req: NextRequest) {
  return smockrHandler(req)
}

export async function PATCH(req: NextRequest) {
  return smockrHandler(req)
}

export async function PUT(req: NextRequest) {
  return smockrHandler(req)
}

export async function DELETE(req: NextRequest) {
  return smockrHandler(req)
}
