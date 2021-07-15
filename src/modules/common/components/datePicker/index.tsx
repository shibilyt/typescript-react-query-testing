import * as React from "react";
import { Box } from "@chakra-ui/react";
import {
  FocusedInput,
  getInitialMonths,
  MonthType,
  START_DATE,
  useDatepicker,
} from "@datepicker-react/hooks";

import { useImmer } from "use-immer";
import Month from "./components/month";
import DatepickerContext from "./context";

interface DateState {
  startDate: Date | null;
  endDate: Date | null;
  focusedInput: FocusedInput;
}

interface DatepickerProps {
  dateState: DateState;
  setDateState: React.Dispatch<React.SetStateAction<DateState>>;
}

export default function Datepicker({
  dateState,
  setDateState,
}: DatepickerProps) {
  const [activeMonths, setActiveMonths] = useImmer<MonthType[]>(() =>
    getInitialMonths(2, null)
  );
  const {
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onDateHover,
    onDateSelect,
    onDateFocus,
  } = useDatepicker({
    startDate: dateState.startDate,
    endDate: dateState.endDate,
    focusedInput: dateState.focusedInput,
    onDatesChange: handleDateChange,
    changeActiveMonthOnSelect: false,
  });

  function handleDateChange(data: DateState) {
    if (!data.focusedInput) {
      setDateState({ ...data, focusedInput: START_DATE });
    } else {
      setDateState(data);
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
        activeMonths,
        setActiveMonths,
      }}
    >
      <Box
        sx={{
          display: "grid",
          margin: "32px 0 0",
          gridTemplateColumns: `repeat(${activeMonths.length}, 240px)`,
          gridGap: "0 64px",
        }}
      >
        {activeMonths.map((month, index) => (
          <Month key={`${month.month}-${month.year}`} index={index} />
        ))}
      </Box>
    </DatepickerContext.Provider>
  );
}
