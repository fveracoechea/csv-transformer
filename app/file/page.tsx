import { parseCSV, transformCSV } from "@/server/upload";
import { ArrowLeftIcon, HomeIcon } from "@radix-ui/react-icons";
import {
  Link,
  Heading,
  Container,
  Card,
  Flex,
  Button,
  Text,
  TextField,
  Grid,
  Box,
} from "@radix-ui/themes";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import { ColumnInput } from "../_components/ColumnInput";
import { revalidatePath } from "next/cache";
import { SubmitButton } from "../_components/SubmitButton";

export default async function Page(props: { searchParams: { name?: string } }) {
  const filename = props.searchParams.name;
  if (!filename) throw new Error("Invalid file name");

  const records = await parseCSV(filename, 0, 3);
  const columns = Object.keys(records.at(0) ?? {});

  async function transform(data: FormData) {
    "use server";

    if (!filename) throw new Error("Invalid file name");

    const newFile = await transformCSV(
      Object.fromEntries(data) as Record<string, string>,
      filename,
    );

    revalidatePath("/");
    redirect("/");
  }

  return (
    <Container size="4" py="8">
      <Flex direction="column" gap="4">
        <Flex gap="4" align="center">
          <Link size="4" asChild>
            <NextLink href="/">
              <Flex align="center" gap="2">
                <HomeIcon width="18" height="18" />
                Home
              </Flex>
            </NextLink>
          </Link>
          <Text size="4">/</Text>
          <Heading size="6" weight="bold" color="gray">
            {filename}
          </Heading>
        </Flex>
        <Card>
          <form action={transform}>
            <Flex direction="column" gap="2">
              {columns.map((c) => {
                const id = c.toLowerCase().replaceAll(" ", "-");
                return <ColumnInput key={c} name={c} id={c.toLowerCase()} />;
              })}
              <Box pt="4">
                <SubmitButton label="Transform" loadingLabel="Loading..." />
              </Box>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}
