'use client'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Music, SendHorizonal } from 'lucide-react'
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

const MusicPage = () => {
  const router = useRouter()
  const [music, setMusic] = useState<string | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setMusic(null)
      const response = await axios.post('/api/music', data)
      setMusic(response.data.audio)
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
        title={'Music Generation'}
        description={'Turn your prompt into music.'}
        icon={Music}
        iconColor='text-emerald-500'
        bgColor='bg-emerald-500/10'
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
                        placeholder='Piano solo'
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
          {!music && !isLoading && <Empty label='No music generated.' />}
          {music && (
            <audio controls className='w-full mt-8'>
              <source src={music} type='audio/mpeg' />
            </audio>
          )}
        </div>
      </div>
    </div>
  )
}

export default MusicPage
