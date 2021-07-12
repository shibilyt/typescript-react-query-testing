import * as React from "react";
import { useTable } from "react-table";
import {
  Table as ChakraTable,
  Thead,
  Tr,
  Tbody,
  Td,
  Th,
  chakra,
  Box,
} from "@chakra-ui/react";
import { TableProperties } from "./types";

export default function Table<T extends Record<string, unknown>>(
  props: React.PropsWithChildren<TableProperties<T> & { isLoading: Boolean }>
): React.ReactElement {
  const { columns, data, isLoading } = props;

  const { getTableProps, getTableBodyProps, prepareRow, rows, headerGroups } =
    useTable<T>({
      columns,
      data,
    });

  return (
    <Box
      mt={8}
      border="1px solid"
      borderColor="nitroGray.200"
      borderRadius="md"
      overflow="hidden"
    >
      <ChakraTable
        size="sm"
        fontSize="sm"
        variant="unstyled"
        boxShadow="base"
        {...getTableProps()}
      >
        <Thead bg="nitroGray.100" h={8} color="nitroGray.600">
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
          {rows.length ? (
            rows.map((row, i) => {
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
                        color={"nitroGray.800"}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })
          ) : (
            <chakra.div
              minHeight="636px"
              data-testid="empty-table"
            ></chakra.div>
          )}
          {isLoading ? (
            <chakra.div minHeight="636px" data-testid="loading"></chakra.div>
          ) : null}
        </Tbody>
      </ChakraTable>
    </Box>
  );
}
