import { type NextRequest } from 'next/server'
import { smockerHandler } from '@/utils/handlers/smocker'

export async function GET(request: NextRequest) {
  return smockerHandler(request)
}

export async function POST(request: NextRequest) {
  return smockerHandler(request)
}

export async function PATCH(request: NextRequest) {
  return smockerHandler(request)
}

export async function PUT(request: NextRequest) {
  return smockerHandler(request)
}

export async function DELETE(request: NextRequest) {
  return smockerHandler(request)
}
