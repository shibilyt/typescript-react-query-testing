import * as React from "react";
import {
  chakra,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  FocusedInput,
  getDateMonthAndYear,
  getInitialMonths,
  MonthType,
  START_DATE,
} from "@datepicker-react/hooks";
import addMonths from "date-fns/addMonths";
import isSameMonth from "date-fns/isSameMonth";
import { useImmer } from "use-immer";

import Datepicker, { DateState } from "modules/common/components/datePicker";
import { Calendar as CalendarIcon } from "assets/Calendar";

import { DateFilterType, filterRanges } from "./types";
import format from "date-fns/format";
import {
  getActiveMonths,
  getPastMonth,
  getPastSixMonths,
  getPastThreeMonths,
  getPastTwoYears,
  getPastWeek,
  getPastYear,
} from "modules/launches/utils";

interface DateFilterProps {
  dateFilter: DateFilterType;
  setDateFilter?: (data: DateFilterType) => void;
  filterRange: string | null;
  setFilterRange: (range: string) => void;
}

export default function DateFilter({
  dateFilter,
  setDateFilter,
  filterRange,
  setFilterRange,
}: DateFilterProps) {
  const [focusedInput, setFocusedInput] =
    React.useState<FocusedInput>(START_DATE);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const prevRange = React.useRef(filterRange);

  React.useEffect(() => {
    if (filterRange !== prevRange.current) {
      prevRange.current = filterRange;
      switch (filterRange) {
        case filterRanges.pastWeek: {
          handlePastWeekClick();
          break;
        }
        case filterRanges.pastMonth: {
          handlePastMonthClick();
          break;
        }
        case filterRanges.pastThreeMonths: {
          handlePastThreeMonthsClick();
          break;
        }
        case filterRanges.pastSixMonths: {
          handlePastSixMonthsClick();
          break;
        }
        case filterRanges.pastYear: {
          handlePastYearClick();
          break;
        }
        case filterRanges.pastTwoYear: {
          handlePastTwoYearClick();
          break;
        }
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRange]);

  const handleDateStateChange = ({ focusedInput, ...data }: DateState) => {
    setFocusedInput(focusedInput);
    setDateFilter?.(data);
    if (data.startDate)
      setFilterRange(
        `${format(data.startDate, "d MMM yyyy")} - ${
          data.endDate ? format(data.endDate, "d MMM yyyy") : "Upcoming"
        }`
      );
  };

  const [activeMonths, setActiveMonths] = useImmer<MonthType[]>(() => {
    if (filterRange) {
      return getActiveMonths(filterRange);
    }
    return getInitialMonths(2, null);
  });

  const handlePastWeekClick = () => {
    const pastWeek = getPastWeek();
    setDateFilter?.(pastWeek);
    setActiveMonths((draft) => {
      draft[0] = getDateMonthAndYear(pastWeek.startDate);
      draft[1] = isSameMonth(pastWeek.startDate, pastWeek.endDate)
        ? getDateMonthAndYear(addMonths(pastWeek.endDate, 1))
        : getDateMonthAndYear(pastWeek.endDate);
    });
    setFilterRange(filterRanges.pastWeek);
  };

  const handlePastMonthClick = () => {
    const pastMonth = getPastMonth();
    setDateFilter?.(pastMonth);
    setActiveMonths((draft) => {
      draft[0] = getDateMonthAndYear(pastMonth.startDate);
      draft[1] = getDateMonthAndYear(pastMonth.endDate);
    });
    setFilterRange(filterRanges.pastMonth);
  };

  const handlePastThreeMonthsClick = () => {
    const pastThreeMonths = getPastThreeMonths();
    setDateFilter?.(pastThreeMonths);
    setActiveMonths((draft) => {
      draft[0] = getDateMonthAndYear(pastThreeMonths.startDate);
      draft[1] = getDateMonthAndYear(pastThreeMonths.endDate);
    });
    setFilterRange(filterRanges.pastThreeMonths);
  };

  const handlePastSixMonthsClick = () => {
    const pastSixMonths = getPastSixMonths();
    setDateFilter?.(pastSixMonths);
    setActiveMonths((draft) => {
      draft[0] = getDateMonthAndYear(pastSixMonths.startDate);
      draft[1] = getDateMonthAndYear(pastSixMonths.endDate);
    });
    setFilterRange(filterRanges.pastSixMonths);
  };

  const handlePastYearClick = () => {
    const pastYear = getPastYear();
    setDateFilter?.(pastYear);
    setActiveMonths((draft) => {
      draft[0] = getDateMonthAndYear(pastYear.startDate);
      draft[1] = getDateMonthAndYear(pastYear.endDate);
    });
    setFilterRange(filterRanges.pastYear);
  };

  const handlePastTwoYearClick = () => {
    const pastTwoYears = getPastTwoYears();
    setDateFilter?.(pastTwoYears);
    setActiveMonths((draft) => {
      draft[0] = getDateMonthAndYear(pastTwoYears.startDate);
      draft[1] = getDateMonthAndYear(pastTwoYears.endDate);
    });
    setFilterRange(filterRanges.pastTwoYear);
  };

  return (
    <>
      <chakra.button
        display="flex"
        alignItems="center"
        p={0}
        data-testid="date-filter"
        onClick={onOpen}
      >
        <CalendarIcon />
        <Text as="span" mx="2">
          {filterRange}
        </Text>
        <ChevronDownIcon />
      </chakra.button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={6} d="flex">
            <Box
              w={48}
              minH="100%"
              mr={4}
              borderRight="1px"
              borderColor="nitroGray.200"
              d="flex"
              flexDir="column"
              alignItems="flex-start"
            >
              <chakra.button
                my={1}
                fontWeight={
                  filterRange === filterRanges.pastWeek ? "600" : "500"
                }
                onClick={handlePastWeekClick}
              >
                Past week
              </chakra.button>
              <chakra.button
                my={1}
                fontWeight={
                  filterRange === filterRanges.pastMonth ? "600" : "500"
                }
                onClick={handlePastMonthClick}
              >
                Past month
              </chakra.button>
              <chakra.button
                my={1}
                fontWeight={
                  filterRange === filterRanges.pastThreeMonths ? "600" : "500"
                }
                onClick={handlePastThreeMonthsClick}
              >
                Past 3 months
              </chakra.button>
              <chakra.button
                my={1}
                fontWeight={
                  filterRange === filterRanges.pastSixMonths ? "600" : "500"
                }
                onClick={handlePastSixMonthsClick}
              >
                Past 6 months
              </chakra.button>
              <chakra.button
                my={1}
                fontWeight={
                  filterRange === filterRanges.pastYear ? "600" : "500"
                }
                onClick={handlePastYearClick}
              >
                Past year
              </chakra.button>
              <chakra.button
                my={1}
                fontWeight={
                  filterRange === filterRanges.pastTwoYear ? "600" : "500"
                }
                onClick={handlePastTwoYearClick}
              >
                Past 2 years
              </chakra.button>
            </Box>
            <Datepicker
              dateState={{ ...dateFilter, focusedInput }}
              setDateState={handleDateStateChange}
              activeMonths={activeMonths}
              setMonths={setActiveMonths}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
