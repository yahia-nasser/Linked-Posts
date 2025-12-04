import * as z from "zod";

export const RegisterScheme = z
  .object({
    name: z.string().min(3, "Minimum length 3").max(10, "Maximum length 10"),
    email: z.email("Invalid Email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[#?!@$%^&*-]/,
        "Password must contain at least one special character like #, ?, @, or $"
      ),
    rePassword: z.string().min(6).max(20),
    dateOfBirth: z.string().min(1, "Date is required"),
    gender: z.string(),
  })
  .refine(
    function (object) {
      if (object.password === object.rePassword) {
        return true;
      }
      return false;
    },
    {
      path: ["rePassword"],
      error: "Password Doesn't match",
    }
  );

export type RegisterSchemeType = z.infer<typeof RegisterScheme>;
