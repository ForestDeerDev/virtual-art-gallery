"use client";

import { Suspense, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { isAxiosError } from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOAuthLogin } from "@/hooks/useAuth";

type Phase = "processing" | "success" | "error";

function getErrorMessage(error: unknown) {
  if (!error) {
    return "";
  }

  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "第三方登录失败，请稍后重试";
  }

  return "第三方登录失败，请稍后重试";
}

function isSafeRedirect(url: string | null): url is string {
  return !!url && url.startsWith("/") && !url.startsWith("//");
}

function OAuthCallbackContent() {
  const router = useRouter();
  const params = useParams<{ provider: string }>();
  const searchParams = useSearchParams();
  const oauthMutation = useOAuthLogin();
  const { mutate } = oauthMutation;

  const provider = params.provider || "github";
  const providerLabel = provider === "github" ? "GitHub" : provider;
  const redirect = searchParams.get("redirect");

  const oauthError = searchParams.get("error");
  const code = searchParams.get("code");

  const fatalError = oauthError
    ? searchParams.get("error_description") || "授权被拒绝，请重试"
    : code
      ? null
      : "缺少授权码，请从登录页重新发起登录";

  const triggeredRef = useRef(false);

  useEffect(() => {
    if (triggeredRef.current || !code) {
      return;
    }
    triggeredRef.current = true;
    mutate({ provider, code });
  }, [provider, code, mutate]);

  useEffect(() => {
    if (!oauthMutation.isSuccess) {
      return;
    }
    const timer = setTimeout(() => {
      router.replace(isSafeRedirect(redirect) ? redirect : "/home");
    }, 1500);
    return () => clearTimeout(timer);
  }, [oauthMutation.isSuccess, redirect, router]);

  const phase: Phase = fatalError
    ? "error"
    : oauthMutation.isSuccess
      ? "success"
      : oauthMutation.isError
        ? "error"
        : "processing";

  const message = fatalError
    ? fatalError
    : oauthMutation.isError
      ? getErrorMessage(oauthMutation.error)
      : oauthMutation.isSuccess
        ? "登录成功，即将返回首页..."
        : `正在验证 ${providerLabel} 授权信息...`;

  return (
    <Card className="relative z-10 w-full max-w-sm rounded-2xl border border-white/40 bg-white/80 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-500">
      <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
        {phase === "processing" && (
          <Loader2 className="size-12 animate-spin text-indigo-500" />
        )}
        {phase === "success" && (
          <CheckCircle2 className="size-12 animate-in zoom-in text-green-500" />
        )}
        {phase === "error" && (
          <XCircle className="size-12 animate-in zoom-in text-destructive" />
        )}

        <p className="text-lg font-semibold text-foreground">
          {phase === "success"
            ? "登录成功"
            : phase === "error"
              ? "登录失败"
              : "正在处理登录"}
        </p>
        <p className="text-sm text-muted-foreground">{message}</p>

        {phase === "error" && (
          <div className="flex w-full flex-col gap-3 pt-2">
            <Button
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/40"
              onClick={() => router.push("/login")}
            >
              返回登录
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/home")}
            >
              返回首页
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function OAuthCallbackPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      />
      <Suspense
        fallback={
          <Loader2 className="relative z-10 size-10 animate-spin text-indigo-500" />
        }
      >
        <OAuthCallbackContent />
      </Suspense>
    </div>
  );
}
