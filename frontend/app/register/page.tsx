"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Palette,
  User,
} from "lucide-react";
import { isAxiosError } from "axios";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/useAuth";
import { useGalleryTags } from "@/hooks/useGallery";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters"),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be at most 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

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

    return (
      error.response.data?.message ?? "Registration failed, please try again"
    );
  }

  return "Registration failed, please try again";
}

function isSafeRedirect(url: string | null): url is string {
  return !!url && url.startsWith("/") && !url.startsWith("//");
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registerMutation = useRegister();
  const { data: availableTags = [], isLoading: tagsLoading } =
    useGalleryTags();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(
      {
        username: values.username,
        email: values.email,
        password: values.password,
        tags: selectedTags,
      },
      {
        onSuccess: () => {
          const redirect = searchParams.get("redirect");
          router.replace(isSafeRedirect(redirect) ? redirect : "/home");
        },
      },
    );
  };

  const errorMessage = getErrorMessage(registerMutation.error);
  const passwordValue = useWatch({ control, name: "password" }) ?? "";
  const passedChecks = [
    passwordValue.length >= 6,
    /\d/.test(passwordValue),
    /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue),
  ].filter(Boolean).length;

  return (
    <div className="flex min-h-screen bg-[#fef7ef]">
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
              Begin Your Art Journey
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create an account to collect and share the artworks you love
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
                  placeholder="Enter a username (3-50 characters)"
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
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  aria-invalid={!!errors.email}
                  className="h-12 rounded-xl bg-white/60 pl-11 focus-visible:border-indigo-400! focus-visible:ring-indigo-400/30!"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
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
                  autoComplete="new-password"
                  placeholder="Enter a password (at least 6 characters)"
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
              {passwordValue.length > 0 && (
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex flex-1 gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < passedChecks
                            ? ["bg-red-400", "bg-amber-400", "bg-emerald-500"][
                                Math.max(passedChecks - 1, 0)
                              ]
                            : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {
                      ["Weak", "Medium", "Strong"][
                        Math.max(passedChecks - 1, 0)
                      ]
                    }
                  </span>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  aria-invalid={!!errors.confirmPassword}
                  className="h-12 rounded-xl bg-white/60 pr-12 pl-11 focus-visible:border-indigo-400! focus-visible:ring-indigo-400/30!"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2">
                {tagsLoading ? (
                  <span className="text-xs text-muted-foreground">
                    Loading tags…
                  </span>
                ) : (
                  availableTags.map((tag) => {
                    const selected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full px-3.5 py-1.5 text-xs transition-all active:scale-95 ${
                          selected
                            ? "bg-[#918a84] text-white shadow-md shadow-[#918a84]/30"
                            : "border border-border bg-background text-muted-foreground hover:border-[#918a84] hover:text-[#7a746e]"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })
                )}
              </div>
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
              disabled={registerMutation.isPending}
              className="group h-12 w-full rounded-xl bg-[#918a84] text-white shadow-md transition-all hover:bg-[#7a746e] active:scale-[0.98]"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-9 text-center text-sm text-muted-foreground">
            Already have an account?
            <Link
              href="/login"
              className="ml-1 font-medium text-[#7a746e] underline decoration-[#918a84]/50 decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-[#5f5a55] hover:decoration-[#7a746e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#918a84]/60"
            >
              Sign in
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

      <aside className="relative hidden w-1/2 shrink-0 overflow-hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/register-bg.jpg')" }}
        />
      </aside>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}
