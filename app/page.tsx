import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Card, Container, Grid, Heading, Text, Flex } from "@radix-ui/themes";
import { FileInput } from "./_components/FileInput";
import { SubmitButton } from "./_components/SubmitButton";
import { upload } from "@/server/upload";
import { UploadedFilesTable } from "./_components/UploadedFilesTable";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function Home() {
  async function onSubmit(data: FormData) {
    "use server";
    await upload(data);
    revalidatePath("/");
  }

  return (
    <Container size="4">
      <Flex pt="8" direction="column" gap="4">
        <Heading size="8" weight="bold" color="gray">
          CSV Transformer
        </Heading>
        <Card className="p-2">
          <Flex direction="column" gap="4">
            <Text size="4" className="font-semibold text-slate-600">
              Upload New File
            </Text>
            <form action={onSubmit} className="w-full">
              <Flex justify="between" width="100%" gap="8">
                <FileInput />
                <SubmitButton />
              </Flex>
            </form>
          </Flex>
        </Card>
        <Card className="p-2">
          <Flex direction="column" gap="4">
            <Text size="4" className="font-semibold text-slate-600">
              Uploaded Files
            </Text>

            <UploadedFilesTable />
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
}
