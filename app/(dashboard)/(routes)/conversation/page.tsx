'use client'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { MessageSquare, SendHorizonal } from 'lucide-react'
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

const ConversationPage = () => {
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
      const response = await axios.post('/api/conversation', {
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
        title={'Conversation'}
        description={'Our most advanced conversation mode.'}
        icon={MessageSquare}
        iconColor='text-violet-500'
        bgColor='bg-violet-500/10'
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
                        placeholder='How do I calculate the radius of a circle?'
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
          <div className='flex flex-col-reverse gap-y-4'>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConversationPage
