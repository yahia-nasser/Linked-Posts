"use client";
import { LoginScheme, LoginSchemeType } from "@/app/scheme/login.scheme";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<LoginSchemeType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginScheme),
  });

  async function handleLogin(values: LoginSchemeType) {
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.ok) {
        setLoading(false);
        toast.success("Login Success", {
          position: "top-center",
          duration: 1000,
        });
        router.push("/");
      } else {
        setLoading(false);
        toast.error(res?.error || "An unknown error occurred", {
          position: "top-center",
          duration: 1000,
        });
      }
    } catch (error: unknown) {
      setLoading(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during sign-in attempt.",
        {
          position: "top-center",
          duration: 3000,
        }
      );
    }
  }

  return (
    <section className="w-full p-5 mt-auto md:w-[40%] min-h-screen overflow-hidden md:p-0 text-center mx-auto flex justify-center items-center flex-col bg-gray-100/20 shadow-2xl  rounded-2xl ">
      <h2 className="font-bold text-5xl mb-5 text-white">Login</h2>
      <Image
        src={"/images/User3.png"}
        alt="user-login"
        width={50}
        height={50}
        className="w-[100px]"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="w-full md:w-1/2 mx-auto mt-3 border-2 rounded-2xl p-6 "
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold mt-5 text-white">
                  <i className="fas fa-envelope"></i> Email
                </FormLabel>
                <FormControl>
                  <Input type="text" className="text-white" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold mt-5 text-white">
                  <i className="fas fa-key"></i> Password
                </FormLabel>
                <FormControl>
                  <Input type="password" className="text-white" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full mt-5 mb-5 cursor-pointer" type="submit">
            {loading ? (
              <i className="fas fa-spinner fa-spin text-white font-bold"></i>
            ) : (
              <div>
                <i className="fas fa-lock-open me-2"></i>
                <span>login</span>
              </div>
            )}
          </Button>
          <div className="flex flex-col gap-3">
            <Link
              href="/register"
              className="p-2 bg-blue-900 text-white rounded w-full"
            >
              <i className="fas fa-arrow-right-to-bracket"></i> Sign Up
            </Link>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default Login;
