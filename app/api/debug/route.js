import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Environment debug',
    env: {
      hasMongoURI: !!process.env.MONGODB_URI,
      mongoURI: process.env.MONGODB_URI ? 
        process.env.MONGODB_URI.replace(/:(.*)@/, ':****@') : 'not set', // Hide password
      nodeEnv: process.env.NODE_ENV
    },
    timestamp: new Date().toISOString()
  })
}