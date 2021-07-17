import { FocusedInput } from "@datepicker-react/hooks";

export interface DateState {
  startDate: Date | null;
  endDate: Date | null;
  focusedInput: FocusedInput;
};
