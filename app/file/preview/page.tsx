import { parseCSV, transformCSV } from "@/server/upload";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FileIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
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
import { revalidatePath } from "next/cache";
import { DataTable } from "@/app/_components/DataTable";

export default async function Page(props: {
  searchParams: { name?: string; start?: string; finish?: string };
}) {
  const filename = props.searchParams.name;
  const start = Number(props.searchParams.start) || 1;
  const finish = Number(props.searchParams.finish) || 10;
  if (!filename) throw new Error("Invalid file name");

  const records = await parseCSV(filename, start, finish);

  const columns = Object.keys(records.at(0) ?? {});

  const Pagination = (
    <Flex gap="4" pt="4" justify="end">
      <Button
        asChild
        disabled={start <= 1}
        variant="soft"
        title="Previous page"
      >
        <NextLink
          href={`/file/preview?${new URLSearchParams({
            name: filename,
            start: String(start - 10 <= 1 ? 1 : start - 10),
            finish: String(finish - 10 <= 10 ? 10 : finish - 10),
          })}`}
        >
          <ArrowLeftIcon height="20" width="20" />
        </NextLink>
      </Button>
      <Button asChild title="Next page" variant="soft">
        <NextLink
          href={`/file/preview?${new URLSearchParams({
            name: filename,
            start: String(start + 10),
            finish: String(finish + 10),
          })}`}
        >
          <ArrowRightIcon height="20" width="20" />
        </NextLink>
      </Button>
    </Flex>
  );

  return (
    <Container size="4" py="8">
      <Flex direction="column" gap="4">
        <Flex justify="between" gap="8">
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
            <Link size="4" asChild>
              <NextLink
                href={`/file?${new URLSearchParams({
                  name: filename,
                }).toString()}`}
              >
                <Flex align="center" gap="2">
                  <FileIcon width="18" height="18" />
                  {filename}
                </Flex>
              </NextLink>
            </Link>
            <Text size="4">/</Text>
            <Heading size="6" weight="bold" color="gray">
              Preview
            </Heading>
          </Flex>
        </Flex>
        <Card>
          <DataTable records={records} columns={columns} count={start} />
          {Pagination}
        </Card>
      </Flex>
    </Container>
  );
}
