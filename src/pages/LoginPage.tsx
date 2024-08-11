import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useAuthContext } from "@/contexts/AuthContext.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

export type LoginFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(5, { message: "Password must be at least 8 characters" }),
});

export default function LoginPage() {
  const { login } = useAuthContext();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
    } catch (error) {
      console.log(`LoginPage: `, error);
      form.setError("root", {
        type: "server",
        message: error as string,
      });
    }
  }
  return (
    <div className="flex flex-grow items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Sign in
              </Button>
              {form.formState.errors.root && (
                <div className="text-red-600">
                  {form.formState.errors.root.message}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="grid gap-4">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to={"../signup"} className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
