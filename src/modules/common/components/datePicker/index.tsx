import * as React from "react";
import { Box } from "@chakra-ui/react";
import {
  getInitialMonths,
  MonthType,
  START_DATE,
  useDatepicker,
} from "@datepicker-react/hooks";

import { Updater, useImmer } from "use-immer";
import Month from "./components/month";
import DatepickerContext from "./context";
import { DateState } from "./types";

export type { DateState };

interface DatepickerProps {
  dateState: DateState;
  setDateState: (data: DateState) => void;
  activeMonths?: MonthType[];
  setMonths?: Updater<MonthType[]>;
}

export default function Datepicker({
  dateState,
  setDateState,
  activeMonths: controlledActiveMonths,
  setMonths,
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
        activeMonths:
          controlledActiveMonths != null
            ? controlledActiveMonths
            : activeMonths,
        setActiveMonths: setMonths != null ? setMonths : setActiveMonths,
      }}
    >
      <Box
        sx={{
          display: "grid",
          margin: "0",
          gridTemplateColumns: `repeat(${activeMonths.length}, 240px)`,
          gridGap: "0 48px",
        }}
      >
        {(controlledActiveMonths ? controlledActiveMonths : activeMonths).map(
          (month, index) => (
            <Month key={`${month.month}-${month.year}`} index={index} />
          )
        )}
      </Box>
    </DatepickerContext.Provider>
  );
}
