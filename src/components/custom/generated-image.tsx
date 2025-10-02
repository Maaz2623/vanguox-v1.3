"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export const GeneratedImage = ({ src, alt, className }: Props) => {
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = alt || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full aspect-[4/5] rounded-lg overflow-hidden cursor-pointer", // 🔹 fixed ratio container
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt ?? ""}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300", // 🔹 fills container evenly
          loading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setLoading(false)}
      />

      {/* Hover overlay */}
      {!loading && hovered && (
        <div className="absolute inset-0 bg-black/40 flex justify-end p-2">
          <Button
            onClick={handleDownload}
            className="text-white rounded-full"
            variant="ghost"
            size="icon"
          >
            <DownloadIcon />
          </Button>
        </div>
      )}
    </div>
  );
};
