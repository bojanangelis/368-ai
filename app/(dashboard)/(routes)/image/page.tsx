'use client'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { ImageIcon, SendHorizonal } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { amountOptions, formSchema, resolutionOptions } from './constants'
import Header from '@/components/Header'
import React, { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import Empty from '@/components/Empty'
import Loader from '@/components/Loader'
import { cn } from '@/lib/utils'
import { SelectContent } from '@radix-ui/react-select'

const ImagePage = () => {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      amount: '1',
      resolution: '512x512',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // reset the images before fetching . . .
      setImages([])

      const response = await axios.post('/api/image', data)
      const urls = response.data.map((image: { url: string }) => image.url)

      setImages(urls)
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
        title={'Image Generation'}
        description={'Turn your prompt into an image.'}
        icon={ImageIcon}
        iconColor='text-pink-700'
        bgColor='bg-pink-700/10'
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
                  <FormItem className='col-span-7 lg:col-span-7'>
                    <FormControl className='m-0 p-0'>
                      <Input
                        className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                        disabled={isLoading}
                        placeholder='Kangaroo carrying a corgi in cartoon style'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='resolution'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className='col-span-1 flex justify-end'>
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
          {images.length === 0 && !isLoading && <Empty label='No images generated.' />}
          <div>Images will be rendered here!</div>
        </div>
      </div>
    </div>
  )
}

export default ImagePage
