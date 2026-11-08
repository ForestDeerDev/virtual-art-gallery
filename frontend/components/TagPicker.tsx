"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

export function TagPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [customTag, setCustomTag] = useState("");

  const toggleTag = (tag: string) => {
    onChange(
      value.includes(tag)
        ? value.filter((item) => item !== tag)
        : [...value, tag],
    );
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (!trimmed) return;
    if (!value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setCustomTag("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {PRESET_TAGS.map((tag) => {
          const selected = value.includes(tag);
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
        {value
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
  );
}
