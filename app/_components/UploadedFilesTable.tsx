import { deleteFile, getUploads } from "@/server/upload";
import {
  DownloadIcon,
  EyeOpenIcon,
  FileIcon,
  RocketIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button, Table } from "@radix-ui/themes";
import { format as formatDate } from "date-fns";
import { revalidatePath } from "next/cache";
import Link from "next/link";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function UploadedFilesTable() {
  const files = await getUploads();

  async function deleteFileAction(data: FormData) {
    "use server";
    const filename = data.get("filename");
    await deleteFile(String(filename));
    revalidatePath("/");
  }

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Filename</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Last Modified</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Size</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={4}> Actions</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {files
          .toSorted((a, b) => b.ctime.getTime() - a.ctime.getTime())
          .map((file) => (
            <Table.Row className="even:bg-slate-2 rounded-3" key={file.uid}>
              <Table.RowHeaderCell>
                <span className="font-medium">{file.filename}</span>
              </Table.RowHeaderCell>
              <Table.Cell>{formatDate(file.mtime, "PPpp")}</Table.Cell>
              <Table.Cell>{formatBytes(file.size)}</Table.Cell>
              <Table.Cell>
                <Button
                  size="1"
                  variant="ghost"
                  title="Transform"
                  className="cursor-pointer"
                  asChild
                >
                  <Link
                    href={`/file?${new URLSearchParams({
                      name: file.filename,
                    }).toString()}`}
                  >
                    <RocketIcon height="20" width="20" />
                  </Link>
                </Button>
              </Table.Cell>
              <Table.Cell>
                <Button
                  size="1"
                  variant="ghost"
                  title="Preview"
                  className="cursor-pointer"
                  asChild
                >
                  <Link
                    href={`/file/preview/?${new URLSearchParams({
                      name: file.filename,
                    }).toString()}`}
                  >
                    <EyeOpenIcon height="20" width="20" />
                  </Link>
                </Button>
              </Table.Cell>
              <Table.Cell>
                <Button variant="ghost" title="Download" asChild>
                  <Link
                    target="_blank"
                    download={file.filename}
                    href={`/api/download?${new URLSearchParams({
                      file: file.filename,
                    })}`}
                  >
                    <DownloadIcon height="20" width="20" />
                  </Link>
                </Button>
              </Table.Cell>
              <Table.Cell>
                <form action={deleteFileAction}>
                  <input type="hidden" name="filename" value={file.filename} />
                  <Button
                    size="1"
                    variant="ghost"
                    title="Delete file"
                    className="cursor-pointer"
                    color="red"
                    type="submit"
                  >
                    <TrashIcon height="20" width="20" />
                  </Button>
                </form>
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
}
