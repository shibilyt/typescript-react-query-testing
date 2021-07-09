import * as React from "react";
import { useTable } from "react-table";
import { Table as ChakraTable, Thead, Tr, Tbody, Td } from "@chakra-ui/react";
import { TableProperties } from "./types";

export default function Table<T extends Record<string, unknown>>(
  props: React.PropsWithChildren<TableProperties<T>>
): React.ReactElement {
  const { columns, data } = props;
  const { getTableProps, getTableBodyProps, prepareRow, rows, headerGroups } =
    useTable<T>({
      columns,
      data,
    });
  return (
    <ChakraTable my="8" borderWidth="1px" fontSize="sm" {...getTableProps()}>
      <Thead bg="gray.50">
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>;
              })}
            </Tr>
          );
        })}
      </Tbody>
    </ChakraTable>
  );
}
