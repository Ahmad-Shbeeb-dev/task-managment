/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type {
  ComponentPropsWithoutRef,
  Dispatch,
  ElementRef,
  KeyboardEvent,
  SetStateAction,
} from "react";
import { forwardRef, useCallback, useRef, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { Command as CommandPrimitive } from "cmdk";

import { cn } from "~/utils/ui";
import { Badge } from "./Badge";
import { Command, CommandGroup, CommandItem } from "./Command";

// type Item = Record<"id" | "label", string>;
interface Item {
  id: string;
  label: string | null;
}

interface Props
  extends Omit<
    ComponentPropsWithoutRef<typeof CommandPrimitive.Item>,
    "onSelect"
  > {
  items: Item[];
  selected: Item[];
  placeHolder: string;
  setSelected: Dispatch<SetStateAction<Item[]>>;
  onUnselect: (item: Item) => void;
  onSelect: (item: Item) => void;
}
const MultiSelect = forwardRef<
  // ElementRef<typeof CommandPrimitive.Input>,
  ElementRef<typeof CommandPrimitive.Item>,
  Props
>(
  (
    {
      items,
      selected,
      setSelected,
      placeHolder,
      onUnselect,
      className,
      onSelect,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    }, []);

    // const handleUnselect = useCallback((item: Item) => {
    //   onUnselect(item);
    // }, []);

    // const handleSelect = useCallback((item: Item) => {
    //   setInputValue("");
    //   onSelect(item);
    // }, []);

    const handleUnselect = (item: Item) => {
      onUnselect(item);
    };

    const handleSelect = (item: Item) => {
      setInputValue("");
      onSelect(item);
    };

    const selectables = items.filter(
      (item) => !selected.map((s) => s.id).includes(item.id),
    );

    return (
      <Command
        onKeyDown={handleKeyDown}
        className={cn("overflow-visible bg-transparent", className)}
      >
        <div className="border-input ring-offset-background focus-within:ring-ring group rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {selected.map((item) => {
              return (
                <Badge key={item.id} variant="secondary">
                  {item.label}
                  <button
                    className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                    type="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <IconX className="text-muted-foreground hover:text-foreground h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            {/* Avoid having the "Search" Icon */}
            <CommandPrimitive.Input
              // {...props}
              ref={inputRef}
              value={inputValue}
              onValueChange={(value: string) => {
                setInputValue(value);
                // props.onValueChange && props.onValueChange(value);
              }}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={placeHolder}
              className="placeholder:text-muted-foreground ml-2 flex-1 bg-transparent outline-none"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && selectables.length > 0 ? (
            <div className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((item) => {
                  return (
                    <CommandItem
                      //  {...props}
                      key={item.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => handleSelect(item)}
                      // onSelect={(value) => {
                      //   // if (inputRef.current) {
                      //   // inputRef.current.value = "";
                      //   // props.value = "";
                      //   // console.log(inputRef.current);
                      //   // }
                      //   // setInputValue("");
                      //   // setSelected((prev) => [...prev, item]);
                      //   // props.onSelect && props.onSelect(item.id);
                      // }}
                      className={"cursor-pointer"}
                    >
                      {item.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </div>
      </Command>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
