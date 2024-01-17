import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Navigate } from "react-router-dom";
import { paths } from "@/router/paths";
import { useAuth } from "@/auth/context/auth-provider";

const authSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(2),
});

function Login() {
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const auth = useAuth();
  console.log(auth);
  if (auth.user) {
    return <Navigate to={paths.home} replace={true} />;
  }

  async function onSubmit(values: z.infer<typeof authSchema>) {
    const error = await auth.signup(values.username, values.password);
    if (!error) {
      return <Navigate to={paths.home} replace={true} />;
    }
  }
  return (
    <Form {...form}>
      <div className="flex justify-center w-full ">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[500px] "
        >
          <div className="space-y-8 border p-5 m-2 border-1 mt-5 rounded-md">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input {...field} />
                  <FormMessage {...field} />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input {...field} type="password" />
                  <FormMessage {...field} />
                </FormItem>
              )}
            />

            <Button
              disabled={form.formState.isLoading || form.formState.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
}

export default Login;
