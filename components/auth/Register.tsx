"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import Logo from "@/assets/LogoNew.png";
import { registerFormSchema } from "@/schemas/registerUserSchema";
import { ZodError } from "zod";
import { parseZodErrors } from "@/utils/parseZodErrors";
import { useRegister } from "@/services/authenticateUser";

const Register: React.FC = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: register, isPending } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    try {
      const validatedData = registerFormSchema.parse({
        name,
        email,
        password,
        confirmPassword,
      });

      register(
        {
          name: validatedData.name,
          email: validatedData.email,
          password: validatedData.password,
        },
        {
          onSuccess: () => {
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setErrors({});
          },
        }
      );
    } catch (error) {
      const fieldErrors = parseZodErrors(error);
      setErrors(fieldErrors); // show errors under each field
    }
  };

  return (
    <div className="w-full max-w-md flex items-center justify-center">
      <div className="w-full space-y-8">
        <div className="flex flex-col items-center justify-center space-y-1">
          <Image src={Logo} alt="logo" width={300} height={300} />
          <h2 className="text-xl font-bold">Create Your StockWise Account</h2>
          <p className="text-sm text-muted-foreground text-center">
            Sign up to start managing your inventory with confidence
          </p>
        </div>

        <div className="p-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your Full Name"
                className={`w-full bg-foreground/5 rounded-sm h-10 ${
                  errors.name ? "border-red-500" : ""
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

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
                required
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
                  required
                />
                {passwordType === "password" ? (
                  <EyeOff
                    size={19}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => setPasswordType("text")}
                  />
                ) : (
                  <Eye
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

            <div className="space-y-2.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  type={confirmPasswordType}
                  id="confirmPassword"
                  placeholder="••••••••"
                  className={`w-full bg-foreground/5 rounded-sm h-10 pr-10 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPasswordType === "password" ? (
                  <EyeOff
                    size={19}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => setConfirmPasswordType("text")}
                  />
                ) : (
                  <Eye
                    size={19}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => setConfirmPasswordType("password")}
                  />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full rounded-sm h-12"
              disabled={isPending}
            >
              {isPending ? "Registering..." : "Sign Up"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-secondary font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
