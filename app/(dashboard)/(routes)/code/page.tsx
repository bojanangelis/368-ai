'use client'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Code, SendHorizonal } from 'lucide-react'
import { ChatCompletionRequestMessage } from 'openai'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { formSchema } from './constants'
import Header from '@/components/Header'
import React, { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import Empty from '@/components/Empty'
import Loader from '@/components/Loader'
import { cn } from '@/lib/utils'
import UserAvatar from '@/components/UserAvatar'
import BotAvatar from '@/components/BotAvatar'
import ReactMarkdown from 'react-markdown'

const CodePage = () => {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: 'user',
        content: data.prompt,
      }
      const newMessages = [...messages, userMessage]
      const response = await axios.post('/api/code', {
        messages: newMessages,
      })

      setMessages((current) => [...current, userMessage, response.data])
      form.reset()
    } catch (err: any) {
      // TODO!!!! Open pro modal pay for more.
      console.error(err)
    } finally {
      router.refresh()
    }
  }

  return (
    <div>
      <Header
        title={'Code generation'}
        description={'Generate code using descriptive text.'}
        icon={Code}
        iconColor='text-green-700'
        bgColor='bg-green-400/10'
      />
      <div className='px-4 lg:px-8'>
        <div>
          <Form {...form}>
            <form
              className='rounded-lg border w-full p-4 px-4 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name='prompt'
                render={({ field }) => (
                  <FormItem className='col-span-10'>
                    <FormControl className='m-0 p-0'>
                      <Input
                        className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                        disabled={isLoading}
                        placeholder='Simple toggle button using react hooks.'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className='col-span-2 flex justify-end'>
                <Button disabled={isLoading} variant='ghost' className='grid-span-2' size='icon'>
                  <SendHorizonal />
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className='space-y-4 mt-4'>
          {isLoading && (
            <div className='p-8 rounded-lg w-full flex items-center justify-center bg-black/90'>
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && <Empty label='No conversation started.' />}
          {/* <div className='flex flex-col-reverse gap-y-4'>
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  'p-8 w-full flex items-start gap-x-8 rounded-lg',
                  message.role === 'user' ? 'bg-white border border-black/10' : 'bg-[#0C0C0D]'
                )}
              >
                {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                <p
                  className={cn(
                    'text-sm',
                    message.role === 'user' ? 'text-black/90' : 'text-white'
                  )}
                >
                  {message.content}
                </p>
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className='overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg'>
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className='bg-black/10 rounded-lg p-1' {...props} />
                    ),
                  }}
                  className='text-sm overflow-hidden leading-7'
                >
                  {message.content || ''}
                </ReactMarkdown>
              </div>
            ))}
          </div> */}
          <div className='flex flex-col-reverse gap-y-4'>
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  'p-8 w-full flex items-start gap-x-8 rounded-lg',
                  message.role === 'user'
                    ? 'bg-white border border-black/10'
                    : 'bg-black text-white'
                )}
              >
                {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className='overflow-auto relative w-full my-2 bg-white/90 text-black p-2 rounded-lg'>
                        <pre {...props} />
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              //@ts-ignore
                              props?.children[0]?.props?.children[0] ?? ''
                            )
                          }
                          className='absolute top-2 right-2'
                        >
                          copy
                        </button>
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className='bg-white/50 rounded-lg p-1' {...props} />
                    ),
                  }}
                  className='text-sm overflow-hidden leading-7'
                >
                  {message.content || ''}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodePage
