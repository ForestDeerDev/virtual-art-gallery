"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  Trash2,
  Reply,
  Calendar,
  Ruler,
  Brush,
  User,
  Tag,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  useArtworkDetail,
  useRelatedArtworks,
  useLikeStatus,
  useToggleLike,
  useComments,
  useCreateComment,
  useDeleteComment,
} from "@/hooks/useArtworkDetail";
import { useIsAuthenticated, useCurrentUser } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Comment } from "@/types";

function formatDate(dateString: string): string {
  return dateString.slice(0, 10);
}

function CommentItem({
  comment,
  artworkId,
  isReply = false,
}: {
  comment: Comment;
  artworkId: number;
  isReply?: boolean;
}) {
  const currentUser = useCurrentUser();
  const isOwner = currentUser?.username === comment.user.username;
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const createComment = useCreateComment(artworkId);
  const deleteComment = useDeleteComment(artworkId);

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;
    createComment.mutate(
      { content: replyContent, parentId: comment.id },
      {
        onSuccess: () => {
          setReplyContent("");
          setReplying(false);
          toast.success("回复成功");
        },
      },
    );
  };

  const handleDelete = () => {
    if (!confirm("确定要删除这条评论吗？")) return;
    deleteComment.mutate(comment.id, {
      onSuccess: () => toast.success("评论已删除"),
    });
  };

  return (
    <div
      className={cn(
        "border-border/60 py-4",
        isReply ? "border-l-2 pl-4" : "border-b",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {comment.user.avatar ? (
            <Image
              src={comment.user.avatar}
              alt={comment.user.username}
              width={39}
              height={39}
              unoptimized
              className={cn(
                "rounded-full object-cover",
                isReply ? "h-9 w-9" : "h-11 w-11",
              )}
            />
          ) : (
            <div
              className={cn(
                "flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-semibold text-white",
                isReply ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm",
              )}
            >
              {comment.user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">
              {comment.user.username}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(comment.createTime)}
            </p>
          </div>
        </div>
        {isOwner && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleDelete}
            aria-label="删除评论"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-foreground/90">
        {comment.content}
      </p>

      {!isReply && (
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplying((v) => !v)}
            className="gap-1.5 text-muted-foreground hover:text-indigo-600"
          >
            <Reply className="size-4" />
            回复
            {comment.replyCount ? `(${comment.replyCount})` : ""}
          </Button>
        </div>
      )}

      {replying && !isReply && (
        <div className="mt-3 space-y-2 pl-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="写下您的回复..."
            rows={2}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReplying(false);
                setReplyContent("");
              }}
            >
              取消
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitReply}
              disabled={!replyContent.trim() || createComment.isPending}
              className="bg-indigo-500 text-white hover:bg-indigo-600"
            >
              {createComment.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "发布回复"
              )}
            </Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              artworkId={artworkId}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArtworkDetailContent() {
  const params = useParams();
  const artworkId = Number(params.id);

  const { data: artwork, isLoading } = useArtworkDetail(artworkId);
  const { data: relatedArtworks } = useRelatedArtworks(
    artwork?.category ?? "",
    artworkId,
  );
  const { data: likeStatus } = useLikeStatus(artworkId);
  const toggleLike = useToggleLike(artworkId);
  const { data: comments } = useComments(artworkId);
  const createComment = useCreateComment(artworkId);

  const isAuthenticated = useIsAuthenticated();
  const [commentContent, setCommentContent] = useState("");
  const [commentExpanded, setCommentExpanded] = useState(false);

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("请先登录后再点赞");
      return;
    }
    toggleLike.mutate(likeStatus?.isLiked ?? false);
  };

  const handleSubmitComment = () => {
    if (!isAuthenticated) {
      toast.error("请先登录后再评论");
      return;
    }
    if (!commentContent.trim()) return;
    createComment.mutate(
      { content: commentContent },
      {
        onSuccess: () => {
          setCommentContent("");
          setCommentExpanded(false);
          toast.success("评论发布成功");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Loader2 className="size-10 animate-spin text-indigo-500" />
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-muted-foreground">作品不存在或已被移除。</p>
        <Button
          variant="outline"
          render={<Link href="/gallery" />}
          nativeButton={false}
        >
          返回画廊
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-page px-6 py-3">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* 主内容区 */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* 作品图片 */}
          <Card className="p-0 ring-0 shadow-none">
            <CardContent className="p-0">
              <div className="relative flex items-center justify-center bg-[#f8f9fa] p-4">
                <div className="relative aspect-[3/2] max-h-[73vh] w-full">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-contain"
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={handleLike}
                  disabled={toggleLike.isPending}
                  className="absolute bottom-3 right-3 gap-1.5 shadow-md"
                >
                  <Heart
                    className={cn(
                      "size-4",
                      likeStatus?.isLiked
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground",
                    )}
                  />
                  {likeStatus?.likeCount ?? 0}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 评论区 */}
          <Card className="ring-1 ring-foreground/5 shadow-none">
            <CardContent className="space-y-4">
              {/* 评论表单 */}
              {commentExpanded ? (
                <div className="space-y-2">
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="写下您的评论..."
                    rows={3}
                    autoFocus
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCommentExpanded(false);
                        setCommentContent("");
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmitComment}
                      disabled={
                        !commentContent.trim() || createComment.isPending
                      }
                      className="bg-indigo-500 text-white hover:bg-indigo-600"
                    >
                      {createComment.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "发布评论"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCommentExpanded(true)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
                >
                  写下您的评论...
                </button>
              )}

              <Separator />

              {/* 评论列表 */}
              <div>
                <h4 className="mb-2 font-medium">
                  评论 ({comments?.length ?? 0})
                </h4>
                {comments?.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    暂无评论，快来发表第一条评论吧！
                  </p>
                ) : (
                  <div>
                    {comments?.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        artworkId={artworkId}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 侧边栏 */}
        <div className="w-full shrink-0 lg:w-80">
          <div className="space-y-6 lg:sticky lg:top-20">
            {/* 作品信息 */}
            <Card className="ring-1 ring-foreground/5 shadow-none">
              <CardHeader>
                <CardTitle>作品信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <h3 className="text-lg font-semibold">{artwork.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <span className="font-medium">{artwork.artist}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="size-4 text-muted-foreground" />
                    <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-600 dark:text-indigo-400">
                      {artwork.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span>
                      {formatDate(
                        artwork.artworkCreateTime || artwork.createTime,
                      )}
                    </span>
                  </div>
                  {artwork.dimensions && (
                    <div className="flex items-center gap-2">
                      <Ruler className="size-4 text-muted-foreground" />
                      <span>{artwork.dimensions}</span>
                    </div>
                  )}
                  {artwork.material && (
                    <div className="flex items-center gap-2">
                      <Brush className="size-4 text-muted-foreground" />
                      <span>{artwork.material}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 相关作品 */}
            <Card className="ring-1 ring-foreground/5 shadow-none">
              <CardHeader>
                <CardTitle>相关作品</CardTitle>
              </CardHeader>
              <CardContent>
                {relatedArtworks?.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    暂无相关作品
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {relatedArtworks?.map((related) => (
                      <Link
                        key={related.id}
                        href={`/artworks/${related.id}`}
                        className="group block"
                      >
                        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={related.imageUrl}
                            alt={related.title}
                            width={200}
                            height={200}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <p className="mt-1.5 truncate text-xs text-foreground/80">
                          {related.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArtworkDetailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <ArtworkDetailContent />
      </main>
      <Footer />
    </div>
  );
}
