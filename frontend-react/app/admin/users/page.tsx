"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  Loader2,
  ShieldCheck,
  Trash2,
  UserRound,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar } from "@/components/Avatar";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useAuth";
import {
  useAdminUsers,
  useDeleteUser,
  useUpdateUserRole,
} from "@/hooks/useAdmin";
import { cn, formatDate } from "@/lib/utils";
import type { UserManagement, UserRole } from "@/types";

const ROLE_OPTIONS: {
  value: UserRole;
  label: string;
  description: string;
  icon: typeof UserRound;
}[] = [
  {
    value: "USER",
    label: "普通用户",
    description: "可以浏览、上传作品并参与互动",
    icon: UserRound,
  },
  {
    value: "ADMIN",
    label: "管理员",
    description: "拥有作品与用户的管理权限",
    icon: ShieldCheck,
  },
];

type UserSortKey = "id" | "username" | "email" | "role" | "createTime";
type SortDirection = "asc" | "desc";

const SORTABLE_COLUMNS: {
  key: UserSortKey;
  label: string;
  className: string;
}[] = [
  { key: "id", label: "ID", className: "w-16 px-6 py-2.5" },
  { key: "username", label: "用户", className: "px-3 py-2.5" },
  { key: "email", label: "邮箱", className: "px-3 py-2.5" },
  { key: "role", label: "角色", className: "px-3 py-2.5" },
  { key: "createTime", label: "注册时间", className: "px-3 py-2.5" },
];

export default function AdminUsersPage() {
  const currentUser = useCurrentUser();
  const { data: users = [], isLoading, isError, refetch } = useAdminUsers();
  const updateRoleMutation = useUpdateUserRole();
  const deleteUserMutation = useDeleteUser();

  const [editingUser, setEditingUser] = useState<UserManagement | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("USER");
  const [sortKey, setSortKey] = useState<UserSortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedUsers = (() => {
    if (!sortKey) return users;
    const direction = sortDirection === "asc" ? 1 : -1;
    return [...users].sort((left, right) => {
      const leftValue = left[sortKey];
      const rightValue = right[sortKey];
      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return (leftValue - rightValue) * direction;
      }
      return (
        String(leftValue ?? "").localeCompare(
          String(rightValue ?? ""),
          "zh-Hans-CN",
        ) * direction
      );
    });
  })();

  const toggleSort = (key: UserSortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection("asc");
      return;
    }
    if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      setSortKey(null);
    }
  };

  const openRoleDialog = (user: UserManagement) => {
    setEditingUser(user);
    setNewRole(user.role);
  };

  const closeRoleDialog = () => {
    setEditingUser(null);
  };

  const handleUpdateRole = () => {
    if (!editingUser) return;
    updateRoleMutation.mutate(
      { userId: editingUser.id, role: newRole },
      {
        onSuccess: () => {
          toast.success("角色已更新");
          closeRoleDialog();
        },
      },
    );
  };

  const handleDeleteUser = (user: UserManagement) => {
    if (!confirm(`确定要删除用户 "${user.username}" 吗？此操作不可恢复。`)) {
      return;
    }
    deleteUserMutation.mutate(user.id, {
      onSuccess: () => toast.success("用户已删除"),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">用户管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          共 {users.length} 位注册用户
        </p>
      </div>

      <Card>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="size-8 animate-spin text-indigo-500" />
              <p className="text-sm text-muted-foreground">加载用户列表中...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <p className="text-sm text-muted-foreground">
                用户列表加载失败，请稍后重试。
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                重新加载
              </Button>
            </div>
          ) : users.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              暂无用户
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                    {SORTABLE_COLUMNS.map((column) => {
                      const isSorted = sortKey === column.key;
                      return (
                        <th
                          key={column.key}
                          className={`${column.className} font-medium`}
                          aria-sort={
                            isSorted
                              ? sortDirection === "asc"
                                ? "ascending"
                                : "descending"
                              : undefined
                          }
                        >
                          <button
                            type="button"
                            onClick={() => toggleSort(column.key)}
                            className="group inline-flex cursor-pointer items-center gap-1 hover:text-foreground"
                          >
                            {column.label}
                            {isSorted ? (
                              sortDirection === "asc" ? (
                                <ArrowUp className="size-3 text-indigo-500" />
                              ) : (
                                <ArrowDown className="size-3 text-indigo-500" />
                              )
                            ) : (
                              <ArrowUpDown className="size-3 opacity-0 transition-opacity group-hover:opacity-60" />
                            )}
                          </button>
                        </th>
                      );
                    })}
                    <th className="px-6 py-2.5 text-right" />
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user) => {
                    const isSelf = user.id === currentUser?.id;
                    const isAdminRole = user.role === "ADMIN";
                    const isDeleting =
                      deleteUserMutation.isPending &&
                      deleteUserMutation.variables === user.id;

                    return (
                      <tr
                        key={user.id}
                        className="border-b last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-6 py-3 tabular-nums text-muted-foreground">
                          {user.id}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={user.avatar}
                              username={user.username}
                              size={40}
                              className="size-10 text-sm"
                            />
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {user.username}
                                {isSelf && (
                                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[11px] font-normal text-muted-foreground">
                                    当前账号
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-[220px] truncate px-3 py-3 text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                              isAdminRole
                                ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                                : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
                            )}
                          >
                            {isAdminRole ? "管理员" : "普通用户"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 tabular-nums text-muted-foreground">
                          {formatDate(user.createTime)}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openRoleDialog(user)}
                              disabled={isSelf}
                              title={
                                isSelf
                                  ? "不能修改当前登录账号的角色"
                                  : "修改角色"
                              }
                            >
                              <UserCog className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteUser(user)}
                              disabled={isSelf || isDeleting}
                              title={
                                isSelf ? "不能删除当前登录账号" : "删除用户"
                              }
                              aria-label="删除用户"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              {isDeleting ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {editingUser && (
        <AdminDialog
          title={`修改${editingUser.username}的角色权限`}
          onClose={closeRoleDialog}
          footer={
            <>
              <Button variant="outline" onClick={closeRoleDialog}>
                取消
              </Button>
              <Button
                onClick={handleUpdateRole}
                disabled={
                  updateRoleMutation.isPending || newRole === editingUser.role
                }
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-700"
              >
                {updateRoleMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                保存更改
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            {ROLE_OPTIONS.map(({ value, label, description, icon: Icon }) => {
              const selected = newRole === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setNewRole(value)}
                  aria-pressed={selected}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                    selected
                      ? "border-indigo-500 bg-indigo-500/5"
                      : "border-border hover:border-indigo-400/60 hover:bg-muted/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg",
                      selected
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {description}
                    </span>
                  </span>
                  {selected && (
                    <Check className="ml-auto size-4 shrink-0 text-indigo-600" />
                  )}
                </button>
              );
            })}
          </div>
        </AdminDialog>
      )}
    </div>
  );
}
