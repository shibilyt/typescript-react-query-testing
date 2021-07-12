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
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Loader } from "assets/Loader";

import { TableProperties, tableStates } from "./types";

export default function Table<T extends Record<string, unknown>>(
  props: React.PropsWithChildren<
    TableProperties<T> & {
      isLoading?: Boolean;
      emptyMessage?: string;
      error?: unknown;
      resetErrorHandler?: () => void;
    }
  >
): React.ReactElement {
  const { columns, data, isLoading, emptyMessage, error, resetErrorHandler } =
    props;

  if (error && !resetErrorHandler) {
    throw new Error(
      `passed "error" prop to <Table/> without providing "resetErrorHandler" method. Please provide it or remove "error".`
    );
  }

  const { getTableProps, getTableBodyProps, prepareRow, rows, headerGroups } =
    useTable<T>({
      columns,
      data,
    });

  const status = React.useMemo(() => {
    if (isLoading) return tableStates.loading;
    if (error) return tableStates.error;
    if (data.length === 0) return tableStates.empty;
    return tableStates.haveData;
  }, [isLoading, data, error]);

  return (
    <Box
      border="1px solid"
      borderColor="nitroGray.200"
      borderRadius="md"
      overflow="hidden"
      boxShadow="base"
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
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
      </ErrorBoundary>
      {status === tableStates.empty ? (
        <chakra.div
          minHeight="636px"
          pt="12"
          display="flex"
          justifyContent="center"
          color="nitroGray.700"
          data-testid="empty-table"
          role="alert"
        >
          {emptyMessage ? emptyMessage : "No data for the table"}
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
        >
          <Loader />
        </chakra.div>
      ) : null}
      {status === tableStates.error && resetErrorHandler ? (
        <ErrorFallback
          error={error as Error}
          resetErrorBoundary={resetErrorHandler}
        ></ErrorFallback>
      ) : null}
    </Box>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Box
      minHeight="636px"
      pt="12"
      display="flex"
      justifyContent="center"
      color="nitroGray.700"
      data-testid="table-error"
      role="alert"
    >
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </Box>
  );
}
