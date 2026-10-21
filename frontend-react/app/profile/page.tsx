"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Loader2, Plus } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import userApi from "@/api/user";
import { useCurrentUser, useIsAdmin } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/auth";
import { normalizeTaggable } from "@/utils/normalize";
import { parseCommaSeparated } from "@/utils/tags";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少3个字符")
    .max(50, "用户名最多50个字符"),
  email: z.email("请输入有效的邮箱地址"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const AVAILABLE_TAGS = [
  "油画",
  "水彩",
  "素描",
  "雕塑",
  "摄影",
  "数字艺术",
  "抽象",
  "写实",
  "现代",
  "古典",
];

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "更新失败，请重试";
  }
  return "更新失败，请重试";
}

function AvatarImage({
  src,
  username,
  className,
}: {
  src?: string;
  username: string;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (src && failedSrc !== src) {
    return (
      <Image
        src={src}
        alt={username}
        width={160}
        height={160}
        unoptimized
        onError={() => setFailedSrc(src)}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-semibold text-white",
        className,
      )}
    >
      {username.charAt(0).toUpperCase()}
    </div>
  );
}

function ProfileContent() {
  const userInfo = useCurrentUser();
  const isAdmin = useIsAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: userInfo?.username ?? "",
      email: userInfo?.email ?? "",
    },
  });

  const [selectedTags, setSelectedTags] = useState<string[]>(() =>
    parseCommaSeparated(userInfo?.tags),
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      // 有新头像时先上传，再随资料一起提交
      let avatar: string | undefined;
      if (avatarFile) {
        const res = await userApi.uploadAvatar(avatarFile);
        avatar = res.url;
      }
      return userApi.updateProfile({
        username: values.username,
        email: values.email,
        tags: selectedTags,
        ...(avatar ? { avatar } : {}),
      });
    },
    onSuccess: (user) => {
      useAuthStore.setState({ userInfo: normalizeTaggable(user) });
      setAvatarFile(null);
      setAvatarPreview("");
      toast.success("资料更新成功");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  if (!userInfo) {
    return null;
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    // 重置以支持重复选择同一文件
    e.target.value = "";
  };

  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row">
      <aside className="lg:w-72 lg:shrink-0">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <AvatarImage
              src={userInfo.avatar}
              username={userInfo.username}
              className="size-36 text-4xl"
            />
            <h2 className="text-lg font-semibold">{userInfo.username}</h2>
            <p className="text-sm text-muted-foreground">{userInfo.email}</p>
            {isAdmin && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-950 dark:text-red-400">
                管理员
              </span>
            )}
          </CardContent>
        </Card>
      </aside>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-lg">个人资料</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="avatar">头像</Label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <label
                htmlFor="avatar"
                className="block size-24 cursor-pointer overflow-hidden rounded-full ring-2 ring-indigo-500/30 transition hover:ring-indigo-500/60"
              >
                {avatarPreview || userInfo.avatar ? (
                  <Image
                    src={avatarPreview || (userInfo.avatar as string)}
                    alt={userInfo.username}
                    width={96}
                    height={96}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center border border-dashed border-border bg-muted/50 text-muted-foreground">
                    <Plus className="size-6" />
                  </span>
                )}
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                className="focus-visible:!border-indigo-400 focus-visible:!ring-indigo-400/30"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                className="focus-visible:!border-indigo-400 focus-visible:!ring-indigo-400/30"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>兴趣标签</Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={
                        selected
                          ? "rounded-full bg-indigo-500 px-3 py-1 text-xs text-white"
                          : "rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-indigo-400 hover:text-indigo-600"
                      }
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending && (
                <Loader2 className="mr-2 animate-spin" />
              )}
              保存更改
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <RequireAuth>
          <ProfileContent />
        </RequireAuth>
      </main>
      <Footer />
    </div>
  );
}
