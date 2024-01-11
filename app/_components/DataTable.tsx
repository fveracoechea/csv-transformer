"use client";

import { Table } from "@radix-ui/themes";

export function DataTable(props: {
  records: Record<string, string>[];
  columns: string[];
  count?: number;
}) {
  const { columns, records, count = 1 } = props;
  return (
    <Table.Root className="table-auto" size="1">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
          {columns.map((c) => (
            <Table.ColumnHeaderCell
              className="min-w-32"
              key={c.toLowerCase().replaceAll(" ", "-")}
            >
              {c}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {records.map((r, i) => (
          <Table.Row key={i} className="even:bg-slate-2">
            <Table.ColumnHeaderCell>{i + count}</Table.ColumnHeaderCell>
            {Object.entries(r).map(([key, value]) => (
              <Table.Cell key={key.toLowerCase().replaceAll(" ", "-") + "data"}>
                {value}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
