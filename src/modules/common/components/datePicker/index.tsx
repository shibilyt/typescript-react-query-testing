import * as React from "react";

import {
  FocusedInput,
  getDateMonthAndYear,
  getCurrentYearMonthAndDate,
  getInitialMonths,
  MonthType,
  START_DATE,
  useDatepicker,
} from "@datepicker-react/hooks";

import Month from "./components/month";
import DatepickerContext from "./context";
import { Box } from "@chakra-ui/react";

interface DateState {
  startDate: Date | null;
  endDate: Date | null;
  focusedInput: FocusedInput;
}

export default function Datepicker() {
  const [state, setState] = React.useState<DateState>({
    startDate: null,
    endDate: null,
    focusedInput: START_DATE,
  });
  const [controlledActiveMonths] = React.useState<MonthType[]>(() => [
    getCurrentYearMonthAndDate(),
    getDateMonthAndYear(new Date("December 17, 2022 03:24:00")),
  ]);

  const {
    firstDayOfWeek,
    activeMonths,
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onDateHover,
    onDateSelect,
    onDateFocus,
    goToPreviousMonths,
    goToNextMonths,
  } = useDatepicker({
    startDate: state.startDate,
    endDate: state.endDate,
    focusedInput: state.focusedInput,
    onDatesChange: handleDateChange,
    changeActiveMonthOnSelect: false,
  });

  function handleDateChange(data: DateState) {
    if (!data.focusedInput) {
      setState({ ...data, focusedInput: START_DATE });
    } else {
      setState(data);
    }
  }

  return (
    <DatepickerContext.Provider
      value={{
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover,
      }}
    >
      <button onClick={goToPreviousMonths}>prev</button>
      <button onClick={goToNextMonths}>Next</button>

      <Box
        sx={{
          display: "grid",
          margin: "32px 0 0",
          gridTemplateColumns: `repeat(${activeMonths.length}, 300px)`,
          gridGap: "0 64px",
        }}
      >
        {controlledActiveMonths.map((month) => (
          <Month
            key={`${month.year}-${month.month}`}
            year={month.year}
            month={month.month}
            firstDayOfWeek={firstDayOfWeek}
          />
        ))}
      </Box>
    </DatepickerContext.Provider>
  );
}
