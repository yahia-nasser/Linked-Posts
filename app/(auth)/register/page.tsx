"use client";
import {
  RegisterScheme,
  RegisterSchemeType,
} from "@/app/scheme/register.scheme";
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
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
const Register = () => {
  const router = useRouter();
  const form = useForm<RegisterSchemeType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(RegisterScheme),
  });

  async function handleRegister(values: RegisterSchemeType) {
    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/users/signup",
        values
      );
      toast.success(data.message, { position: "top-center", duration: 3000 });
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong!", {
          position: "top-center",
          duration: 3000,
        });
      } else {
        toast.error("Unexpected error occurred", {
          position: "top-center",
          duration: 3000,
        });
      }
    }
  }
  return (
    <section className="w-full p-5 mt-auto md:w-[40%] min-h-screen overflow-hidden md:p-0 text-center mx-auto flex justify-center items-center flex-col bg-gray-100/20 shadow-2xl  rounded-2xl ">
      <h2 className="font-bold text-5xl mb-5 text-white">Sign Up</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegister)}
          className="w-full md:w-1/2 mx-auto mt-3 border-2 rounded-2xl p-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-white">
                  <i className="fas fa-file-signature"></i> Name
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-white">
                  <i className="fas fa-envelope"></i> Email
                </FormLabel>
                <FormControl>
                  <Input type="email" className="text-white" {...field} />
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
                <FormLabel className="font-bold text-white">
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

          <FormField
            control={form.control}
            name="rePassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-white">
                  <i className="fas fa-check-double"></i> Confirm Password
                </FormLabel>
                <FormControl>
                  <Input type="password" className="text-white" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-white">
                  <i className="fas fa-calendar-check"></i> Date Of Birth
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    max="2010-12-31"
                    className="text-white"
                    {...field}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold my-2 text-white">
                  <i className="fas fa-genderless"></i> Gender
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col gap-2 text-white"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="male"
                        id="male"
                        className="text-white"
                      />
                      <Label htmlFor="male">
                        <i className="fas fa-mars"></i> Male
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="female"
                        id="female"
                        className="text-white"
                      />
                      <Label htmlFor="female">
                        <i className="fas fa-venus"></i> Female
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-1/2 my-5 cursor-pointer" type="submit">
            <i className="fas fa-folder-plus"></i> Sign Up
          </Button>
          <br />
          <Link
            href="/login"
            className="px-8 py-2 bg-cyan-500 text-white mt-5 rounded-2xl"
          >
            <i className="fas fa-arrow-right-to-bracket"></i> Login
          </Link>
        </form>
      </Form>
    </section>
  );
};

export default Register;
