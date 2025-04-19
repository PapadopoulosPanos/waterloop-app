"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  onChange?: (date: Date | undefined) => void;
  variant?:
    | "outline"
    | "destructive"
    | "ghost"
    | "link"
    | "secondary"
    | "default"
    | undefined;
};

export function DatePicker({ variant, onChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();

  const onSelect = (dt: Date | undefined) => {
    setDate(dt);
    if (onChange) onChange(dt);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant ?? "outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
