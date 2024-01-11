"use client";

import { Theme } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

export function Providers(props: PropsWithChildren) {
  return (
    <Theme
      accentColor="indigo"
      grayColor="slate"
      panelBackground="translucent"
      radius="small"
      scaling="100%"
    >
      {props.children}
    </Theme>
  );
}
