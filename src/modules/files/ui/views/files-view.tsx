"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { GeneratedImage } from "@/components/custom/generated-image";

export const FilesView = () => {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.files.getFiles.queryOptions());

  return (
    <div className="p-5">
      <div className="mb-5">
        <SidebarTrigger />
      </div>

      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] w-full rounded-xl overflow-hidden"
                >
                  <Skeleton className="w-full h-full rounded-xl" />
                </div>
              ))
            : data?.map((file: { id: string; url: string; name?: string }) => (
                <div
                  key={file.id}
                  className="aspect-[4/5] w-full rounded-xl overflow-hidden"
                >
                  <GeneratedImage
                    src={file.url}
                    alt={file.name ?? ""}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};
