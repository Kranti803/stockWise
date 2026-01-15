"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/assets/LogoNew.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema } from "@/schemas/loginSchema";
import { ZodError } from "zod";
import { parseZodErrors } from "@/utils/parseZodErrors";
import { useLogin } from "@/services/authenticateUser";

const Login: React.FC = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: login, isPending } = useLogin();

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = loginSchema.parse({
        email,
        password,
      });

      login(
        { email: validatedData.email, password: validatedData.password },
        {
          onSuccess: () => {
            setEmail("");
            setPassword("");
            setErrors({});
            router.push("/");
          },
        }
      );
    } catch (error) {
      const fieldErrors = parseZodErrors(error);
      setErrors(fieldErrors); 
    }
  };

  return (
    <div className="w-full max-w-md flex items-center justify-center">
      <div className="w-full space-y-8">
        <div className="flex flex-col items-center justify-center space-y-1">
          <Image src={Logo} alt="logo" width={300} height={300} />
          <p className="text-lg text-muted-foreground text-center">
            Professional Inventory Management System
          </p>
        </div>

        <div className="p-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                className={`w-full bg-foreground/5 rounded-sm h-10 ${
                  errors.email ? "border-red-500" : ""
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={passwordType}
                  id="password"
                  placeholder="••••••••"
                  className={`w-full bg-foreground/5 rounded-sm h-10 pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordType === "password" ? (
                  <Eye
                    size={19}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => setPasswordType("text")}
                  />
                ) : (
                  <EyeOff
                    size={19}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => setPasswordType("password")}
                  />
                )}
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full rounded-sm h-12"
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-secondary font-medium hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
