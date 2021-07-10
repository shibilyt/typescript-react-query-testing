import * as React from "react";
import { useTable } from "react-table";
import {
  Table as ChakraTable,
  Thead,
  Tr,
  Tbody,
  Td,
  Th,
} from "@chakra-ui/react";
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
    <ChakraTable
      size="sm"
      my="8"
      borderWidth="1px"
      variant="unstyled"
      fontSize="sm"
      {...getTableProps()}
    >
      <Thead bg="gray.50" h={8}>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                fontWeight={"medium"}
                {...column.getHeaderProps()}
                fontSize={12}
                textTransform="capitalize"
              >
                {column.render("Header")}
              </Th>
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
                return (
                  <Td
                    fontSize={12}
                    fontWeight="normal"
                    lineHeight={1}
                    border="none"
                    py={5}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </Td>
                );
              })}
            </Tr>
          );
        })}
      </Tbody>
    </ChakraTable>
  );
}
