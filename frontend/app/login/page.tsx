"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Palette,
  User,
} from "lucide-react";
import { isAxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLogin, redirectToGithub } from "@/hooks/useAuth";

const loginSchema = z.object({
  username: z.string().min(1, "Please enter username"),
  password: z.string().min(1, "Please enter password"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function getErrorMessage(error: unknown) {
  if (!error) {
    return "";
  }

  if (isAxiosError<{ message?: string }>(error)) {
    if (!error.response) {
      return error.code === "ECONNABORTED"
        ? "Request timed out, please try again"
        : "Network error, please check your connection";
    }

    return error.response.data?.message ?? "Login failed, please try again";
  }

  return "Login failed, please try again";
}

function isSafeRedirect(url: string | null): url is string {
  return !!url && url.startsWith("/") && !url.startsWith("//");
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        const redirect = searchParams.get("redirect");
        router.replace(isSafeRedirect(redirect) ? redirect : "/gallery");
      },
    });
  };

  const errorMessage = getErrorMessage(loginMutation.error);

  return (
    <div className="flex min-h-screen bg-[#fef7ef]">
      {/* Left side: login form */}
      <main className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-lg animate-fade-up">
          <div className="mb-9 flex items-center gap-3 lg:hidden">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#918a84] to-[#7a746e] shadow-lg shadow-[#918a84]/30">
              <Palette className="size-5 text-white" />
            </div>
            <p className="font-serif text-xl font-semibold">
              Virtual Art Gallery
            </p>
          </div>

          <div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to account and continue art journey
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-9 space-y-6"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="Enter username"
                  aria-invalid={!!errors.username}
                  className="h-12 rounded-xl bg-white/60 pl-11 focus-visible:border-indigo-400! focus-visible:ring-indigo-400/30!"
                  {...register("username")}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  aria-invalid={!!errors.password}
                  className="h-12 rounded-xl bg-white/60 pr-12 pl-11 focus-visible:border-indigo-400! focus-visible:ring-indigo-400/30!"
                  {...register("password")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="flex animate-in items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive fade-in slide-in-from-top-1"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="group h-12 w-full rounded-xl bg-[#918a84] text-white shadow-md transition-all hover:bg-[#7a746e] active:scale-[0.98]"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-9 flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs tracking-widest text-muted-foreground">
              Or continue with
            </span>
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={redirectToGithub}
            className="mt-6 h-12 w-full rounded-xl"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="size-5"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Continue with GitHub
          </Button>

          <p className="mt-9 text-center text-sm text-muted-foreground">
            No account yet?
            <Link
              href="/register"
              className="ml-1 font-medium text-[#7a746e] underline decoration-[#918a84]/50 decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-[#5f5a55] hover:decoration-[#7a746e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#918a84]/60"
            >
              Sign up
            </Link>
          </p>

          <p className="mt-3 text-center text-sm text-muted-foreground/70">
            <Link
              href="/gallery"
              className="underline decoration-[#918a84]/50 decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-foreground hover:decoration-[#7a746e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#918a84]/60"
            >
              Browse the gallery
            </Link>
          </p>
        </div>
      </main>

      {/* Right side: brand visual */}
      <aside className="relative hidden w-1/2 shrink-0 overflow-hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/login-bg.jpg')" }}
        />
      </aside>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
