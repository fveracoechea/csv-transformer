import fs from "node:fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get("file");
  if (!file) return NextResponse.json({ message: "invalid file" });

  const data = fs.readFileSync(`./data/${file}`);

  return new NextResponse(data, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${file.replace(
        "./data/",
        "",
      )}"`,
    },
  });
}
