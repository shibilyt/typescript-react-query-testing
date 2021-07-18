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
import addDays from "date-fns/addDays";
import addMonths from "date-fns/addMonths";
import isSameMonth from "date-fns/isSameMonth";
import addYears from "date-fns/addYears";
import { useImmer } from "use-immer";

import Datepicker, { DateState } from "modules/common/components/datePicker";
import { Calendar as CalendarIcon } from "assets/Calendar";

import { DateFilterType, filterStatuses } from "./types";
import format from "date-fns/format";

interface DateFilterProps {
  dateFilter: DateFilterType;
  setDateFilter: (data: DateFilterType) => void;
  filterRange: string;
  setFilterRange: React.Dispatch<React.SetStateAction<string>>;
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

  React.useEffect(() => {
    switch (filterRange) {
      case filterStatuses.pastWeek: {
        handlePastWeekClick();
        break;
      }
      case filterStatuses.pastMonth: {
        handlePastMonthClick();
        break;
      }
      case filterStatuses.pastThreeMonths: {
        handlePastThreeMonthsClick();
        break;
      }
      case filterStatuses.pastSixMonths: {
        handlePastSixMonthsClick();
        break;
      }
      case filterStatuses.pastYear: {
        handlePastYearClick();
        break;
      }
      case filterStatuses.pastTwoYear: {
        handlePastTwoYearClick();
        break;
      }
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRange]);

  const handleDateStateChange = ({ focusedInput, ...data }: DateState) => {
    setFocusedInput(focusedInput);
    setDateFilter(data);
    if (data.startDate)
      setFilterRange(
        `${format(data.startDate, "d MMM yyyy")} - ${
          data.endDate ? format(data.endDate, "d MMM yyyy") : "Upcoming"
        }`
      );
  };

  const [activeMonths, setActiveMonths] = useImmer<MonthType[]>(() =>
    getInitialMonths(2, null)
  );

  const handlePastWeekClick = () => {
    const endDate = new Date();
    const startDate = addDays(endDate, -7);
    setDateFilter({
      startDate,
      endDate,
    });
    setActiveMonths((draft) => {
      draft[0] = getDateMonthAndYear(startDate);
      draft[1] = isSameMonth(startDate, endDate)
        ? getDateMonthAndYear(addMonths(endDate, 1))
        : getDateMonthAndYear(endDate);
    });
    setFilterRange(filterStatuses.pastWeek);
  };

  const handlePastMonthClick = () => {
    const endDate = new Date();
    const startDate = addMonths(endDate, -1);
    setDateFilter({
      startDate,
      endDate,
    });
    setActiveMonths((draft) => {
      draft[0] = getDateMonthAndYear(startDate);
      draft[1] = getDateMonthAndYear(endDate);
    });
    setFilterRange(filterStatuses.pastMonth);
  };

  const handlePastThreeMonthsClick = () => {
    const endDate = new Date();
    const startDate = addMonths(endDate, -3);
    setDateFilter({
      startDate,
      endDate,
    });
    setActiveMonths((draft) => {
      draft[0] = getDateMonthAndYear(startDate);
      draft[1] = getDateMonthAndYear(endDate);
    });
    setFilterRange(filterStatuses.pastThreeMonths);
  };

  const handlePastSixMonthsClick = () => {
    const endDate = new Date();
    const startDate = addMonths(endDate, -6);
    setDateFilter({
      startDate,
      endDate,
    });
    setActiveMonths((draft) => {
      draft[0] = getDateMonthAndYear(startDate);
      draft[1] = getDateMonthAndYear(endDate);
    });
    setFilterRange(filterStatuses.pastSixMonths);
  };

  const handlePastYearClick = () => {
    const endDate = new Date();
    const startDate = addYears(endDate, -1);
    setDateFilter({
      startDate,
      endDate,
    });
    setActiveMonths((draft) => {
      draft[0] = getDateMonthAndYear(startDate);
      draft[1] = getDateMonthAndYear(endDate);
    });
    setFilterRange(filterStatuses.pastYear);
  };

  const handlePastTwoYearClick = () => {
    const endDate = new Date();
    const startDate = addYears(endDate, -2);
    setDateFilter({
      startDate,
      endDate,
    });
    setActiveMonths((draft) => {
      draft[0] = getDateMonthAndYear(startDate);
      draft[1] = getDateMonthAndYear(endDate);
    });
    setFilterRange(filterStatuses.pastTwoYear);
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
                  filterRange === filterStatuses.pastWeek ? "600" : "500"
                }
                onClick={handlePastWeekClick}
              >
                Past week
              </chakra.button>
              <chakra.button
                my={1}
                fontWeight={
                  filterRange === filterStatuses.pastMonth ? "600" : "500"
                }
                onClick={handlePastMonthClick}
              >
                Past month
              </chakra.button>
              <chakra.button
                my={1}
                fontWeight={
                  filterRange === filterStatuses.pastThreeMonths ? "600" : "500"
                }
                onClick={handlePastThreeMonthsClick}
              >
                Past 3 months
              </chakra.button>
              <chakra.button
                my={1}
                fontWeight={
                  filterRange === filterStatuses.pastSixMonths ? "600" : "500"
                }
                onClick={handlePastSixMonthsClick}
              >
                Past 6 months
              </chakra.button>
              <chakra.button
                my={1}
                fontWeight={
                  filterRange === filterStatuses.pastYear ? "600" : "500"
                }
                onClick={handlePastYearClick}
              >
                Past year
              </chakra.button>
              <chakra.button
                my={1}
                fontWeight={
                  filterRange === filterStatuses.pastTwoYear ? "600" : "500"
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
