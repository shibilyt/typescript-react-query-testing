import * as React from "react";
import { usePagination, useTable } from "react-table";
import {
  Table as ChakraTable,
  Thead,
  Tr,
  Tbody,
  Td,
  Th,
  chakra,
  Box,
  VStack,
  Button,
} from "@chakra-ui/react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Loader } from "assets/Loader";
import Pagination from "./components/pagination";

import { TableProperties, tableStates } from "./types";

export default function Table<T extends Record<string, any>>(
  props: React.PropsWithChildren<
    TableProperties<T> & {
      isLoading?: Boolean;
      emptyMessage?: string;
      error?: unknown;
      resetErrorHandler?: () => void;
      page?: number | null;
      pageCount?: number;
      onPageChange?: (page: number) => void;
      onRowClick?: (row: T) => void;
    }
  >
): React.ReactElement {
  const {
    columns,
    data,
    isLoading,
    emptyMessage,
    error,
    resetErrorHandler,
    page: initialPage,
    pageCount: controlledPageCount,
    onPageChange,
    onRowClick,
  } = props;

  if (error && !resetErrorHandler) {
    throw new Error(
      `passed "error" prop to <Table/> without providing "resetErrorHandler" method. Please provide it or remove "error".`
    );
  }

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    page,
    headerGroups,
    pageCount,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable<T>(
    {
      columns,
      data,
      initialState: { pageIndex: initialPage || 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    usePagination
  );

  const prevInitialPage = React.useRef(initialPage);
  React.useEffect(() => {
    if (initialPage !== prevInitialPage.current && initialPage != null) {
      prevInitialPage.current = initialPage;
      gotoPage(initialPage);
    }
  }, [initialPage, gotoPage]);

  React.useEffect(() => {
    onPageChange?.(pageIndex);
  }, [pageIndex, onPageChange]);

  const status = React.useMemo(() => {
    if (isLoading) return tableStates.loading;
    if (error) return tableStates.error;
    if (data.length === 0) return tableStates.empty;
    return tableStates.haveData;
  }, [isLoading, data, error]);

  return (
    <>
      <Box
        border="1px solid"
        borderColor="nitroGray.200"
        borderRadius="md"
        overflow="hidden"
        boxShadow="base"
        minH="668px"
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
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Tr
                      {...row.getRowProps({
                        onClick: onRowClick
                          ? () => onRowClick(row.original)
                          : undefined,
                      } as any)}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <Td
                            fontSize={12}
                            fontWeight="normal"
                            lineHeight={1}
                            border="none"
                            py={5}
                            color={"nitroGray.800"}
                            cursor="pointer"
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
      <Box d="flex" justifyContent="flex-end">
        <Pagination
          page={pageIndex}
          pageCount={pageCount}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageOptions={pageOptions}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
        />
      </Box>
    </>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <VStack
      minHeight="636px"
      pt="12"
      alignItems="center"
      color="nitroGray.700"
      data-testid="table-error"
      role="alert"
    >
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </VStack>
  );
}
