"use client";

import { Checkbox, Flex, Text, TextField } from "@radix-ui/themes";
import { ComponentProps } from "react";

export function ColumnInput(props: ComponentProps<typeof TextField.Input>) {
  return (
    <Flex
      gap="6"
      p="2"
      className="rounded-3 flex-1 even:bg-slate-3"
      align="center"
      justify="start"
    >
      <Text
        as="label"
        htmlFor={props.id}
        size="3"
        weight="medium"
        className="flex-[2]"
      >
        {props.name}
      </Text>
      <TextField.Root className="flex-[2]">
        <TextField.Input placeholder="Field name" {...props} />
      </TextField.Root>

      <Text as="label" size="2">
        <Flex gap="2">
          <Checkbox name={`${props.name} [duplicate]`} /> Remove Duplicates
        </Flex>
      </Text>

      <Text as="label" htmlFor={`${props.id}-replace`} size="2">
        Replace
      </Text>
      <TextField.Root className="flex-1">
        <TextField.Input
          placeholder="Value"
          id={`${props.id}-replace`}
          name={`${props.name} [replace]`}
        />
      </TextField.Root>
      <TextField.Root className="flex-1">
        <TextField.Input
          placeholder="With"
          name={`${props.name} [replace-with]`}
        />
      </TextField.Root>
    </Flex>
  );
}
