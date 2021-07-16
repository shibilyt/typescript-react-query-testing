import { screen, act, within } from "@testing-library/react";
import { render } from "test/test-utils";
import format from "date-fns/format";
import userEvent from "@testing-library/user-event";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";
import setDate from "date-fns/setDate";
import * as datePickerUtils from "@datepicker-react/hooks";

import Datepicker from "../";

afterEach(() => {
  jest.restoreAllMocks();
});
describe("Datepicker", () => {
  test("should be able to select a month and year using MonthYearSelect", () => {
    render(
      <Datepicker
        dateState={{
          startDate: null,
          endDate: null,
          focusedInput: "startDate",
        }}
        setDateState={() => {
          act(() => {});
        }}
      />
    );

    let initialMonths = datePickerUtils.getInitialMonths(2, null);
    const startMonthSelect = screen.getByTestId("start-month");
    expect(startMonthSelect).toHaveTextContent(
      format(initialMonths[0].date, "LLLL")
    );

    userEvent.click(startMonthSelect);
    userEvent.click(screen.getByRole("option", { name: /february/i }));
    expect(screen.getByTestId("start-month")).toHaveTextContent(/february/i);

    const startYearSelect = screen.getByTestId("start-year");
    expect(startYearSelect).toHaveTextContent(
      format(initialMonths[0].date, "yyyy")
    );

    userEvent.click(startYearSelect);
    userEvent.click(screen.getByRole("option", { name: /2020/i }));
    expect(screen.getByTestId("start-year")).toHaveTextContent(/2020/i);
  });

  test("clicking on a month/year combo greater than end month is disabled in start month", () => {
    const startDate = new Date(2020, 4, 1);
    const startMonth = {
      month: getMonth(startDate),
      year: getYear(startDate),
      date: startDate,
    };
    const endDate = new Date(2020, 5, 1);
    const endMonth = {
      month: getMonth(endDate),
      year: getYear(endDate),
      date: endDate,
    };
    jest
      .spyOn(datePickerUtils, "getInitialMonths")
      .mockReturnValue([startMonth, endMonth]);

    render(
      <Datepicker
        dateState={{
          startDate: null,
          endDate: null,
          focusedInput: "startDate",
        }}
        setDateState={() => {
          act(() => {});
        }}
      />
    );

    expect(screen.getByTestId("start-year")).toHaveTextContent(startMonth.year);
    expect(screen.getByTestId("start-month")).toHaveTextContent(
      format(startMonth.date, "LLLL")
    );
    expect(screen.getByTestId("end-year")).toHaveTextContent(endMonth.year);
    expect(screen.getByTestId("end-month")).toHaveTextContent(
      format(endMonth.date, "LLLL")
    );

    // if same year, start month shouldnot be able to select >= end month
    userEvent.click(screen.getByTestId("start-month"));
    userEvent.click(screen.getByRole("option", { name: /march/i }));
    expect(screen.getByTestId("start-month")).toHaveTextContent(/march/i);

    userEvent.click(screen.getByTestId("start-month"));
    userEvent.click(screen.getByRole("option", { name: /august/i }));
    expect(screen.getByTestId("start-month")).toHaveTextContent(/march/i);
    userEvent.click(screen.getByTestId("start-month"));

    // if same year, end month shouldnot be able to select <= start month
    userEvent.click(screen.getByTestId("end-month"));
    userEvent.click(screen.getByRole("option", { name: /august/i }));
    expect(screen.getByTestId("end-month")).toHaveTextContent(/august/i);

    userEvent.click(screen.getByTestId("end-month"));
    userEvent.click(screen.getByRole("option", { name: /february/i }));
    expect(screen.getByTestId("end-month")).toHaveTextContent(/august/i);
    userEvent.click(screen.getByTestId("end-month"));

    // start year should not be able to select >= end year
    userEvent.click(screen.getByTestId("start-year"));
    userEvent.click(screen.getByRole("option", { name: /2019/i }));
    expect(screen.getByTestId("start-year")).toHaveTextContent(/2019/i);

    userEvent.click(screen.getByTestId("start-year"));
    userEvent.click(screen.getByRole("option", { name: /2023/i }));
    expect(screen.getByTestId("start-year")).toHaveTextContent(/2019/i);
    userEvent.click(screen.getByTestId("start-year"));

    // start year should not be able to select >= end year
    userEvent.click(screen.getByTestId("end-year"));
    userEvent.click(screen.getByRole("option", { name: /2022/i }));
    expect(screen.getByTestId("end-year")).toHaveTextContent(/2022/i);

    userEvent.click(screen.getByTestId("end-year"));
    userEvent.click(screen.getByRole("option", { name: /2018/i }));
    expect(screen.getByTestId("end-year")).toHaveTextContent(/2022/i);
    userEvent.click(screen.getByTestId("end-year"));
  });

  test("is able to select date range", async () => {
    let startDate = null;
    let endDate = null;
    let focusedInput = "startDate";
    const { rerender } = render(
      <Datepicker
        dateState={{
          startDate,
          endDate,
          focusedInput,
        }}
        setDateState={(data) => {
          act(() => {
            startDate = data.startDate;
            endDate = data.endDate;
            focusedInput = data.focusedInput;
          });
        }}
      />
    );

    let initialMonths = datePickerUtils.getInitialMonths(2, null);

    const startMonth = screen.getByTestId("start-month-days");
    const endMonth = screen.getByTestId("end-month-days");
    const startDay = 5;
    const endDay = 11;

    userEvent.click(within(startMonth).getByRole("button", { name: startDay }));
    expect(startDate).not.toBeNull();
    expect(focusedInput).toEqual("endDate");

    rerender(
      <Datepicker
        dateState={{
          startDate,
          endDate,
          focusedInput,
        }}
        setDateState={(data) => {
          act(() => {
            startDate = data.startDate;
            endDate = data.endDate;
            focusedInput = data.focusedInput;
          });
        }}
      />
    );
    userEvent.click(within(endMonth).getByRole("button", { name: endDay }));
    expect(endDate).not.toBeNull();

    const nextStartDate = setDate(initialMonths[0].date, startDay);
    const nextEndDate = setDate(initialMonths[1].date, endDay);
    expect(startDate).toEqual(nextStartDate);
    expect(endDate).toEqual(nextEndDate);
  });
});
