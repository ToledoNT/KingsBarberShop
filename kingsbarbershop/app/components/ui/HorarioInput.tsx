"use client";

import React from "react";
import TimePicker from "react-time-picker";

interface HorarioInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function HorarioInput({ value, onChange }: HorarioInputProps) {
  return (
    <TimePicker
      onChange={(v) => onChange(v || "")}
      value={value || undefined}
      format="HH:mm"
      disableClock
      clearIcon={null}
      className="bg-[#1B1B1B] text-[#E5E5E5] rounded p-2 border border-gray-700 w-full"
      locale="en-GB" // força 24h
      hourPlaceholder="hh"
      minutePlaceholder="mm"
    />
  );
}
