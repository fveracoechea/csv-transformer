"use client";

import { Text } from "@radix-ui/themes";

export function FileInput() {
  return (
    <Text size="3" className="block min-w-96" as="label">
      <input
        required
        type="file"
        id="csv"
        name="csv"
        accept=".csv"
        className="block w-full font-medium text-slate-10
      file:mr-4 file:py-1 file:px-2
      file:rounded-2 file:border-0
      file:text-sm file:font-medium
      file:bg-indigo-3 file:text-indigo-10
      hover:file:bg-indigo-5
    "
      />
    </Text>
  );
}
