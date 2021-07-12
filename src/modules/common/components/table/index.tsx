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
import { Loader } from "assets/Loader";

import { TableProperties, tableStates } from "./types";

export default function Table<T extends Record<string, unknown>>(
  props: React.PropsWithChildren<
    TableProperties<T> & {
      isLoading: Boolean;
      emptyMessage: string;
    }
  >
): React.ReactElement {
  const { columns, data, isLoading, emptyMessage } = props;

  const { getTableProps, getTableBodyProps, prepareRow, rows, headerGroups } =
    useTable<T>({
      columns,
      data,
    });

  const status = React.useMemo(() => {
    if (isLoading) return tableStates.loading;
    if (data && data === []) return tableStates.empty;
    return tableStates.haveData;
  }, [isLoading, data]);
  return (
    <Box
      my={8}
      border="1px solid"
      borderColor="nitroGray.200"
      borderRadius="md"
      overflow="hidden"
      boxShadow="base"
    >
      <ChakraTable
        size="sm"
        fontSize="sm"
        variant="unstyled"
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
        {status === tableStates.haveData ? (
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
                        color={"nitroGray.800"}
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
        ) : null}
      </ChakraTable>
      {status === tableStates.empty ? (
        <chakra.div
          minHeight="636px"
          pt="12"
          display="flex"
          justifyContent="center"
          color="nitroGray.700"
          data-testid="empty-table"
        >
          {emptyMessage}
        </chakra.div>
      ) : null}
      {status === tableStates.loading ? (
        <chakra.div
          minHeight="636px"
          pt="12"
          data-testid="loading"
          display="flex"
          justifyContent="center"
          alignItems="center"
          color="nitroGray.700"
        >
          <Loader />
        </chakra.div>
      ) : null}
    </Box>
  );
}
