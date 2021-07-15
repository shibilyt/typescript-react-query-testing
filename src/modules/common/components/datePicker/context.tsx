import * as React from "react";
import { MonthType } from "@datepicker-react/hooks";
import { Updater } from "use-immer";

export type DatePickerContext = {
  focusedDate: Date | null;
  isDateFocused: (date: Date) => boolean;
  isDateSelected: (date: Date) => boolean;
  isDateHovered: (date: Date) => boolean;
  isDateBlocked: (date: Date) => boolean;
  isFirstOrLastSelectedDate: (date: Date) => boolean;
  onDateFocus: (date: Date) => void;
  onDateHover: (date: Date) => void;
  onDateSelect: (date: Date) => void;
  activeMonths: MonthType[];
  setActiveMonths: Updater<MonthType[]>;
};

export const datepickerContextDefaultValue: DatePickerContext = {
  focusedDate: null,
  isDateFocused: () => false,
  isDateSelected: () => false,
  isDateHovered: () => false,
  isDateBlocked: () => false,
  isFirstOrLastSelectedDate: () => false,
  onDateFocus: () => {},
  onDateHover: () => {},
  onDateSelect: () => {},
  activeMonths: [],
  setActiveMonths: () => {},
};

export default React.createContext(datepickerContextDefaultValue);
