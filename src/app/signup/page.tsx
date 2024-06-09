"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "~/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { toast } from "~/components/ui/use-toast"
import { api } from "~/trpc/react";

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    })
})

export default function Signup() {
    const loginMutation = api.user.createUser.useMutation();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    useEffect(() => {
        if (loginMutation.isSuccess) {
            const body = {
                username: loginMutation.data.username,
                password: loginMutation.data.password
            }

            window.localStorage.setItem("user", JSON.stringify(body))

            redirect('/main')
        }
    }, [loginMutation])

    if (loginMutation.isPending) {
        return(
            <div className="h-screen w-full flex-1 flex-row flex items-center justify-center">
                <LoadingSpinner className="h-11" />
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex-1 flex-col flex items-center justify-center bg-slate-950">
            <div className="">
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit((data) => loginMutation.mutate({ ...data }))} 
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
