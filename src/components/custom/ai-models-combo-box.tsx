"use client";

import * as React from "react";
import { Check, ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Model } from "@/types";

export function AiModelsComboBox({
  models,
  value,
  onChange,
}: {
  models: Model[];
  value: string;
  onChange: (model: Model) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedModel = models.find((m) => m.id === value);

  // Group models dynamically by prefix before "/"
  const groupedModels = models.reduce((acc, model) => {
    const provider = model.id.split("/")[0]; // e.g. "openai"
    if (!acc[provider]) acc[provider] = [];
    acc[provider].push(model);
    return acc;
  }, {} as Record<string, Model[]>);

  const providers = Object.keys(groupedModels);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-fit justify-between max-w-[200px] sm:max-w-none"
        >
          {selectedModel ? (
            <div className="flex items-center gap-x-2 truncate">
              <Image
                src={selectedModel.icon}
                alt={selectedModel.name}
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="truncate">{selectedModel.name}</span>
            </div>
          ) : (
            "Select model..."
          )}
          <ChevronUpIcon className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[90vw] sm:w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search model..." className="text-sm" />

          {/* ✅ Scrollable grouped list */}
          <ScrollArea className="max-h-[50vh] sm:max-h-[300px]">
            <CommandList>
              <CommandEmpty>No model found.</CommandEmpty>

              {providers.map((provider, i) => (
                <React.Fragment key={provider}>
                  <CommandGroup heading={provider} className="capitalize">
                    {groupedModels[provider].map((model) => (
                      <CommandItem
                        key={model.id}
                        value={model.id}
                        onSelect={() => {
                          onChange(model);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-x-2 truncate">
                          <Image
                            src={model.icon}
                            alt={model.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          <span className="truncate">{model.name}</span>
                        </div>
                        {model.id === value && (
                          <Check className="ml-auto h-4 w-4 opacity-100" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {i < providers.length - 1 && <CommandSeparator />}
                </React.Fragment>
              ))}
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
