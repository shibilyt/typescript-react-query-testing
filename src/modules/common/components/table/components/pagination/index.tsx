import * as React from "react";
import { Box, chakra } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface PaginationProps {
  page: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageOptions: number[];
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
  nextPage: () => void;
  previousPage: () => void;
}

export default function Pagination({
  page,
  pageCount,
  canPreviousPage,
  canNextPage,
  pageOptions,
  gotoPage,
  nextPage,
  previousPage,
}: PaginationProps) {
  if (pageCount === 1) return null;

  let pages = getPageRanges(page, pageCount, pageOptions);

  return (
    <Box mt={4}>
      <chakra.button
        onClick={previousPage}
        disabled={!canPreviousPage}
        lineHeight={4}
        fontSize={12}
        h="40px"
        w="40px"
        border="1px"
        borderColor="nitroGray.200"
        borderTopLeftRadius={8}
        borderBottomLeftRadius={8}
      >
        <ChevronLeftIcon h="18px" w="18px" color="nitroGray.600" />
      </chakra.button>
      {pages.map((pageNumber, index) => (
        <chakra.button
          key={index}
          onClick={() => {
            pageNumber !== -1 && gotoPage(pageNumber);
          }}
          lineHeight={4}
          fontSize={12}
          fontWeight={page === pageNumber ? "600" : "500"}
          h="40px"
          w="40px"
          border="1px"
          borderColor="nitroGray.200"
          color="nitroGray.600"
        >
          {pageNumber === -1 ? "..." : pageNumber + 1}
        </chakra.button>
      ))}
      <chakra.button
        onClick={nextPage}
        disabled={!canNextPage}
        lineHeight={4}
        fontSize={12}
        h="40px"
        w="40px"
        border="1px"
        borderColor="nitroGray.200"
        borderTopRightRadius={8}
        borderBottomRightRadius={8}
      >
        <ChevronRightIcon h="18px" w="18px" color="nitroGray.600" />
      </chakra.button>
    </Box>
  );
}

function getPageRanges(page: number, pageCount: number, pageOptions: number[]) {
  if (pageCount <= 3) {
    return pageOptions;
  }

  return pageOptions.reduce<number[]>((paginationList, currentPage) => {
    const isFirstOrLastPage = [0, pageCount - 1].includes(currentPage);
    if (isFirstOrLastPage) return [...paginationList, currentPage];

    const isCurrentPage = page === currentPage;
    if (isCurrentPage) return [...paginationList, currentPage];

    const isSiblingPage = [page - 1, page + 1].includes(currentPage);
    if (isSiblingPage) return [...paginationList, currentPage];

    const isPrevPageIgnored = paginationList[paginationList.length - 1] === -1;
    if (!isPrevPageIgnored) return [...paginationList, -1];

    return paginationList;
  }, []);
}
