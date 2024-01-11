import { Abel } from "next/font/google";
import { throws } from "node:assert";
import { PathLike, Stats, write } from "node:fs";
import fs from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";

async function exists(path: PathLike) {
  if (!path) return false;
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export async function deleteFile(filename: string) {
  const path = `data/${filename}`;
  const fileExists = await exists(path);
  if (fileExists) {
    await fs.unlink(path);
  }
}

export async function upload(data: FormData) {
  const file = data.get("csv");
  if (!(file instanceof File)) throw new Error("Invalid file provided");

  const path = `data/${file.name}`;
  const fileExists = await exists(path);

  if (fileExists) {
    await fs.unlink(path);
  }

  if (file instanceof File) await fs.writeFile(path, file.stream() as any);
}

export type UploadedFile = Stats & { filename: string };

export async function getUploads(): Promise<UploadedFile[]> {
  const files = await fs.readdir("./data/");

  const stats = await Promise.all(
    files.map((file) => fs.stat(`./data/${file}`)),
  );

  return stats.map((stat, idx) => ({ ...stat, filename: files[idx] }));
}

export async function parseCSV(
  filename: string,
  start: number | null = null,
  finish: number | null = null,
) {
  const records: Record<string, string>[] = [];
  const stream = createReadStream(`./data/${filename}`);
  const parser = parse({ columns: true, bom: true });

  let count = 0;

  function done() {
    stream.unpipe(parser);
    parser.end();
    stream.destroy();
  }

  parser.on("finish", done);
  stream.pipe(parser);

  for await (const record of parser) {
    if (
      typeof start === "number" &&
      typeof finish === "number" &&
      typeof count === "number"
    ) {
      if (count < start) {
        count++;
        continue;
      }
      if (count >= start && count <= finish) {
        records.push(record);
        count++;
      } else {
        done();
        break;
      }
    } else {
      records.push(record);
    }
  }

  return records;
}

function mapRecord(
  config: Record<string, string>,
  record: Record<string, string>,
  duplicatesTable: Record<string, boolean>,
) {
  const result: Record<string, string> = {};
  let duplicate = "";

  for (const key in record) {
    if (!Object.hasOwn(record, key)) continue;
    const element = record[key];
    const mapping = config[key];

    if (!mapping) continue;

    const replace = config[`${key} [replace]`];
    const replaceValue = config[`${key} [replace-with]`];
    const shouldRemoveDuplicates = Boolean(config[`${key} [duplicate]`]);

    if (shouldRemoveDuplicates) {
      duplicate += ` ${element}`;
    }

    if (replace) {
      result[mapping] = element.replace(replace, replaceValue);
    } else {
      result[mapping] = element;
    }
  }

  duplicate = duplicate.trim();

  if (duplicate) {
    if (Object.hasOwn(duplicatesTable, duplicate)) {
      return null;
    } else {
      duplicatesTable[duplicate] = true;
    }
  }

  return result;
}

export async function transformCSV(
  config: Record<string, string>,
  filename: string,
) {
  const records: Record<string, string>[] = [];
  const duplicatesTable: Record<string, boolean> = {};
  const newFile = `./data/${filename.replace(".csv", "_[transfromed].csv")}`;

  const parser = parse({ columns: true, bom: true });
  const readStream = createReadStream(`./data/${filename}`);

  const stringifier = stringify({ bom: true, header: true });
  const writeStream = createWriteStream(newFile);

  stringifier.pipe(writeStream);

  stringifier.on("finish", function () {
    stringifier.unpipe(writeStream);
    writeStream.end();
    writeStream.destroy();
    stringifier.destroy();
  });

  parser.on("finish", () => {
    readStream.unpipe(parser);
    parser.end();
    readStream.destroy();
  });

  readStream.pipe(parser);

  for await (const record of parser) {
    const mappedRecord = mapRecord(config, record, duplicatesTable);
    if (mappedRecord) stringifier.write(mappedRecord);
  }

  return newFile;
}
