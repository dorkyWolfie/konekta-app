// middleware.js - Next.js middleware
import { NextResponse } from 'next/server'

const rateLimitStore = new Map()

export function middleware(request) {
  const pathname = request.nextUrl.pathname

  // Rate limit specific endpoints
  const rateLimits = [
    {
      paths: ['/api/register'],
      limit: 5,
      window: 15 * 60 * 1000, // 15 minutes
      message: 'Too many registration attempts. Try again in 15 minutes.'
    },
    {
      paths: ['/api/auth/credentials'],
      limit: 5,
      window: 15 * 60 * 1000, // 15 minutes
      message: 'Too many login attempts. Try again in 15 minutes.'
    },
    {
      paths: ['/api/upload'],
      limit: 10,
      window: 60 * 1000, // 1 minute
      message: 'Too many uploads. Try again in a minute.'
    },
    {
      paths: ['/api/delete'],
      limit: 20,
      window: 60 * 1000, // 1 minute
      message: 'Too many delete attempts. Slow down!'
    }
  ]

  const applicableLimit = rateLimits.find(limit =>
    limit.paths.some(path => pathname.startsWith(path))
  )

  if (!applicableLimit) return NextResponse.next()

  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
  const key = `${ip}:${pathname}`
  const now = Date.now()

  const data = rateLimitStore.get(key) || { requests: [] }

  // Clean old requests
  data.requests = data.requests.filter(time => now - time < applicableLimit.window)

  // Check limit
  if (data.requests.length >= applicableLimit.limit) {
    const oldestRequest = Math.min(...data.requests)
    const resetTime = oldestRequest + applicableLimit.window
    const retryAfter = Math.ceil((resetTime - now) / 1000)

    return new Response(
      JSON.stringify({ error: applicableLimit.message }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString()
        }
      }
    )
  }

  // Add current request
  data.requests.push(now)
  rateLimitStore.set(key, data)

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/register',
    '/api/upload',
    '/api/delete',
    '/api/auth/credentials'
  ]
}