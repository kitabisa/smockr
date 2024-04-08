export async function GET() {
  return Response.json({
    health_check: 'up'
  })
}
