// middleware.js - Add this to your project root
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
      message: 'Too many login attempts. Try again in 15 minutes.'
    },
    {
      paths: ['/lib/auth/credentials'],
      limit: 5,
      window: 15 * 60 * 1000, // 15 minutes
      message: 'Too many login attempts. Try again in 15 minutes.'
    },
    {
      paths: ['/api/upload'],
      limit: 5,
      window: 60 * 1000, // 1 minute
      message: 'Too many uploads. Try again in a minute.'
    },
    {
      paths: ['/actions/pageActions'],
      limit: 30,
      window: 60 * 1000, // 1 minute
      message: 'Too many save attempts. Slow down!'
    },
    {
      paths: ['/actions/linkActions'],
      limit: 30,
      window: 60 * 1000, // 1 minute
      message: 'Too many save attempts. Slow down!'
    },
    {
      paths: ['/actions/buttonActions'],
      limit: 30,
      window: 60 * 1000, // 1 minute
      message: 'Too many save attempts. Slow down!'
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
    '/api/upload/:path*',
    '/api/pageActions/:path*'
  ]
}

// Update your upload route to handle rate limit responses
// libs/upload.js - Add error handling
export async function upload(ev, callbackFn) {
  const file = ev.target.files?.[0];

  if (file) {
    const uploadPromise = new Promise((resolve, reject) => {
      const data = new FormData;
      data.set('file', file);
      fetch('/api/upload', {
        method: 'POST',
        body: data,
      }).then(async response => {
        if (response.ok) {
          const link = await response.json();
          callbackFn(link);
          resolve(link);
        } else if (response.status === 429) {
          // Handle rate limit
          const error = await response.json();
          reject(new Error(error.error || 'Rate limit exceeded'));
        } else {
          reject(new Error('Upload failed'));
        }
      }).catch(reject);
    });

    await toast.promise(uploadPromise, {
      loading: 'Се прикачува...',
      success: 'Успешно е прикачено!',
      error: (err) => err.message || 'Неуспешно прикачување!'
    });
  }
}