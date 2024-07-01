'use client'

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import useSWR from "swr";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formSchema = z.object({
  ip: z.string().trim().min(1, {
    message: "IP is required"
  }).ip({
    message: "Invalid IP address",
  }),
}).strip();

export default function Home() {

  const [ip, setIp] = useState<string>("")

  const { data, error, isLoading } = useSWR(`http://127.0.0.1:3001/${ip}`, fetcher, {
    dedupingInterval: 0, // Disable caching
    revalidateOnFocus: false, // Disable revalidation on focus
    revalidateOnReconnect: false, // Disable revalidation on reconnect
  })

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (values: z.infer<typeof formSchema>) => {
    setIp(values.ip)
  };

  return (
    <main >
      <div className="bg-white py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <h2 className="inline sm:block">想要获取IP地址信息？</h2>{' '}
            <p className="inline sm:block">请输入您的IP。</p>
          </div>
          <form className="mt-10 max-w-md" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-x-4">
              <label htmlFor="ip-address" className="sr-only">
                Ip address
              </label>
              <input
                id="ip-address"
                type="text"
                className="min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter your ipv4 or ipv6"
                {...register("ip")}
              />
              <button
                type="submit"
                className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                获取
              </button>
            </div>
            {errors.ip?.message && <p>{errors.ip?.message}</p>}
          </form>
          {/* <DevTool control={control} /> */}

          {data && (
            <div>
              <h1>Result:</h1>
              <p>Country Code: {data.country_code}</p>
              <p>Country Name: {data.country_name}</p>
              <p>Region Name: {data.region_name}</p>
              <p>City Name: {data.city_name}</p>
              <p>Latitude: {data.latitude}</p>
              <p>Longitude: {data.longitude}</p>
              <p>Zip Code: {data.zip_code}</p>
              <p>Time Zone: {data.time_zone}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
