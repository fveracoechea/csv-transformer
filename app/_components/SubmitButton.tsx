"use client";

import { ReloadIcon, UploadIcon } from "@radix-ui/react-icons";
import { Button, Flex } from "@radix-ui/themes";
import { useFormStatus } from "react-dom";

export function SubmitButton(props: { label?: string; loadingLabel?: string }) {
  const { label = "Upload File", loadingLabel = "Uploading..." } = props;
  const { pending } = useFormStatus();

  return (
    <Flex grow="1" gap="4" justify="end">
      <Button type="reset" color="gray">
        Reset
      </Button>
      <Button type="submit" disabled={pending} aria-disabled={pending}>
        {pending ? (
          <ReloadIcon className="animate-spin" height="20" width="20" />
        ) : (
          <UploadIcon height="20" width="20" />
        )}
        {pending ? loadingLabel : label}
      </Button>
    </Flex>
  );
}
