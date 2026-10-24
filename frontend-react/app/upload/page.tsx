"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import artworkApi from "@/api/artwork";

const CATEGORIES = ["油画", "水彩", "素描", "雕塑", "摄影", "数字艺术", "其他"];

const PRESET_TAGS = [
  "抽象",
  "写实",
  "现代",
  "古典",
  "风景",
  "人物",
  "静物",
  "动物",
  "建筑",
  "肖像",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const uploadSchema = z.object({
  title: z.string().min(1, "请输入作品标题").max(100, "标题不超过 100 字"),
  category: z.string().min(1, "请选择作品分类"),
  description: z.string().max(2000, "描述不超过 2000 字").optional(),
  imageUrl: z.string().min(1, "请先上传作品图片"),
  tags: z.array(z.string()),
  dimensions: z.string().max(50, "尺寸不超过 50 字").optional(),
  material: z.string().max(50, "材质不超过 50 字").optional(),
  featured: z.boolean().optional(),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

function UploadContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [customTag, setCustomTag] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      imageUrl: "",
      tags: [],
      dimensions: "",
      material: "",
      featured: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: UploadFormValues) =>
      artworkApi.createArtwork({
        title: data.title,
        category: data.category,
        description: data.description || undefined,
        imageUrl: data.imageUrl,
        tags: data.tags.length ? data.tags : undefined,
        dimensions: data.dimensions || undefined,
        material: data.material || undefined,
        featured: data.featured || undefined,
      }),
    onSuccess: () => {
      toast.success("作品发布成功！");
      router.push("/gallery");
    },
    onError: (error) => {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "发布失败，请重试");
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("文件大小不能超过 10MB");
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setUploadingImage(true);

    try {
      const response = await artworkApi.uploadArtworkImage(file);
      setValue("imageUrl", response.url, { shouldValidate: true });
    } catch {
      toast.error("图片上传失败，请重试");
      URL.revokeObjectURL(previewUrl);
      setImagePreview("");
      setValue("imageUrl", "", { shouldValidate: true });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleTag = (tag: string) => {
    const current = getValues("tags");
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setValue("tags", updated, { shouldValidate: true });
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (!trimmed) return;
    const current = getValues("tags");
    if (!current.includes(trimmed)) {
      setValue("tags", [...current, trimmed], { shouldValidate: true });
    }
    setCustomTag("");
  };

  const tags = useWatch({ control, name: "tags" });
  const imageUrl = useWatch({ control, name: "imageUrl" });
  const featured = useWatch({ control, name: "featured" });

  const onSubmit = handleSubmit((data) => {
    createMutation.mutate(data);
  });

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/60">
      <Navbar />
      <Card className="mx-auto my-5 w-[calc(100%-2rem)] max-w-3xl animate-in fade-in duration-300 overflow-visible shadow-[0_4px_16px_rgba(0,0,0,0.08)] ring-border/60">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">上传作品</CardTitle>
        </CardHeader>
        <CardContent className="gap-5">
          <form onSubmit={onSubmit} className="space-y-4">
            {/* 图片上传 */}
            <div className="space-y-2">
              <Label>
                作品图片 <span className="text-destructive">*</span>
              </Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {imagePreview ? (
                <div className="relative overflow-hidden rounded-lg border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="作品预览"
                    className="mx-auto max-h-[400px] w-full object-contain"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2 size-8 rounded-full bg-background/80 hover:bg-background"
                    onClick={() => {
                      URL.revokeObjectURL(imagePreview);
                      setImagePreview("");
                      setValue("imageUrl", "", { shouldValidate: true });
                    }}
                    aria-label="移除图片"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input px-6 py-6 text-muted-foreground transition-colors hover:border-indigo-400 hover:text-indigo-500"
                >
                  {uploadingImage ? (
                    <Loader2 className="size-8 animate-spin" />
                  ) : (
                    <ImageIcon className="size-8" />
                  )}
                  <span className="text-sm">
                    {uploadingImage ? "上传中..." : "点击上传图片"}
                  </span>
                </button>
              )}
              <p className="text-xs text-muted-foreground">
                支持 JPG、PNG、GIF 格式，最大 10MB
              </p>
              {errors.imageUrl && (
                <p className="text-sm text-destructive">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* 标题 */}
            <div className="space-y-2">
              <Label htmlFor="title">
                作品标题 <span className="text-destructive">*</span>
              </Label>
              <Input id="title" placeholder="标题" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* 分类 */}
            <div className="space-y-2">
              <Label htmlFor="category">
                作品分类 <span className="text-destructive">*</span>
              </Label>
              <select
                id="category"
                {...register("category")}
                className="h-9 w-full min-w-0 rounded-md border border-input bg-background px-2.5 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="">分类</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* 描述 */}
            <div className="space-y-2">
              <Label htmlFor="description">作品描述</Label>
              <textarea
                id="description"
                rows={3}
                placeholder="描述您的作品..."
                {...register("description")}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* 尺寸 + 材质 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dimensions">作品尺寸</Label>
                <Input
                  id="dimensions"
                  placeholder="例如：100cm × 80cm"
                  {...register("dimensions")}
                />
                {errors.dimensions && (
                  <p className="text-sm text-destructive">
                    {errors.dimensions.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="material">作品材质</Label>
                <Input
                  id="material"
                  placeholder="例如：布面油画"
                  {...register("material")}
                />
                {errors.material && (
                  <p className="text-sm text-destructive">
                    {errors.material.message}
                  </p>
                )}
              </div>
            </div>

            {/* 标签 */}
            <div className="space-y-2">
              <Label>作品标签</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_TAGS.map((tag) => {
                  const selected = tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={
                        "rounded-full border px-3 py-1 text-sm transition-all " +
                        (selected
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-600"
                          : "border-input text-muted-foreground hover:border-indigo-400 hover:text-indigo-500")
                      }
                    >
                      {tag}
                    </button>
                  );
                })}
                {tags
                  .filter((tag) => !PRESET_TAGS.includes(tag))
                  .map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className="rounded-full border border-indigo-500 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-600"
                    >
                      {tag} ✕
                    </button>
                  ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="添加自定义标签"
                  value={customTag}
                  onChange={(event) => setCustomTag(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCustomTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addCustomTag}>
                  添加
                </Button>
              </div>
            </div>

            {/* 精选 */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                checked={featured}
                onCheckedChange={(checked) =>
                  setValue("featured", checked === true, {
                    shouldValidate: true,
                  })
                }
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                设为精选作品
              </label>
            </div>

            {/* 按钮 */}
            <div className="sticky bottom-0 z-10 -mx-6 -mb-6 flex gap-3 rounded-b-xl border-t bg-card px-6 py-3">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                disabled={
                  !imageUrl || createMutation.isPending || uploadingImage
                }
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 animate-spin" />
                )}
                <Upload
                  className={createMutation.isPending ? "" : "mr-2 size-4"}
                />
                {createMutation.isPending ? "发布中..." : "发布作品"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={createMutation.isPending}
              >
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UploadPage() {
  return (
    <RequireAuth>
      <UploadContent />
    </RequireAuth>
  );
}
