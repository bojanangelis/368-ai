import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { messages } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!configuration.apiKey) {
      return new NextResponse('OpenAI API key not found', { status: 500 })
    }
    if (!messages) {
      return new NextResponse('Missing messages', { status: 400 })
    }
    const freeTrail = await checkApiLimit()

    if (!freeTrail) {
      return new NextResponse('Free trail has expired.', { status: 403 })
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    })

    await increaseApiLimit()

    return NextResponse.json(response.data.choices[0].message)
  } catch (err) {
    console.error('[CONVERSATION_ERROR]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
