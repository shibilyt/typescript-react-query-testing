import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import add from "date-fns/add";
import getDate from "date-fns/getDate/index";
import isSameDay from "date-fns/isSameDay";
import { render } from "test/test-utils";
import DateFilter from "../";
import { filterStatuses } from "../types";

describe("DateFilter ", () => {
  test("initial filter sets correct dateState", () => {
    let startDate = null;
    let endDate = null;
    let filterRange = filterStatuses.pastThreeMonths;
    render(
      <DateFilter
        dateFilter={{
          startDate,
          endDate,
        }}
        setDateFilter={(data) => {
          act(() => {
            startDate = data.startDate;
            endDate = data.endDate;
          });
        }}
        filterRange={filterRange}
        setFilterRange={(range) =>
          act(() => {
            filterRange = range;
          })
        }
      />
    );

    expect(screen.getByTestId("date-filter")).toHaveTextContent(filterRange);

    // past 3 months
    const endDay = new Date();
    const startDay = add(endDay, { months: -3 });
    expect(isSameDay(startDate, startDay)).toBeTruthy();
    expect(isSameDay(endDate, endDay)).toBeTruthy();
  });

  test("selecting options in the DateFilter updates state", () => {
    let startDate = null;
    let endDate = null;
    let filterRange = filterStatuses.pastSixMonths;
    const { rerender } = render(
      <DateFilter
        dateFilter={{
          startDate,
          endDate,
        }}
        setDateFilter={(data) => {
          act(() => {
            startDate = data.startDate;
            endDate = data.endDate;
          });
        }}
        filterRange={filterRange}
        setFilterRange={(range) => {
          act(() => {
            filterRange = range;
          });
        }}
      />
    );

    expect(screen.getByTestId("date-filter")).toHaveTextContent(filterRange);

    userEvent.click(screen.getByTestId("date-filter"));

    userEvent.click(screen.getByRole("button", { name: /past week/i }));

    rerender(
      <DateFilter
        dateFilter={{
          startDate,
          endDate,
        }}
        setDateFilter={(data) => {
          act(() => {
            startDate = data.startDate;
            endDate = data.endDate;
          });
        }}
        filterRange={filterRange}
        setFilterRange={(range) => {
          act(() => {
            filterRange = range;
          });
        }}
      />
    );

    expect(screen.getByTestId("date-filter")).toHaveTextContent(
      filterStatuses.pastWeek
    );
    const endDay = new Date();
    const startDay = add(endDay, { days: -7 });
    expect(isSameDay(startDate, startDay)).toBeTruthy();
    expect(isSameDay(endDate, endDay)).toBeTruthy();
  });

  test("selecting date ranges from the active months set date states", () => {
    let startDate = null;
    let endDate = null;
    let filterRange = filterStatuses.pastSixMonths;
    const { rerender } = render(
      <DateFilter
        dateFilter={{
          startDate,
          endDate,
        }}
        setDateFilter={(data) => {
          act(() => {
            startDate = data.startDate;
            endDate = data.endDate;
          });
        }}
        filterRange={filterRange}
        setFilterRange={(range) => {
          act(() => {
            filterRange = range;
          });
        }}
      />
    );

    expect(screen.getByTestId("date-filter")).toHaveTextContent(filterRange);

    userEvent.click(screen.getByTestId("date-filter"));

    const startDay = 8;
    const endDay = 14;
    userEvent.click(
      within(screen.getByTestId("start-month-days")).getByRole("button", {
        name: startDay,
      })
    );

    expect(getDate(startDate)).toEqual(8);

    rerender(
      <DateFilter
        dateFilter={{
          startDate,
          endDate,
        }}
        setDateFilter={(data) => {
          act(() => {
            startDate = data.startDate;
            endDate = data.endDate;
          });
        }}
        filterRange={filterRange}
        setFilterRange={(range) => {
          act(() => {
            filterRange = range;
          });
        }}
      />
    );

    userEvent.click(screen.getByTestId("date-filter"));

    userEvent.click(
      within(screen.getByTestId("end-month-days")).getByRole("button", {
        name: endDay,
      })
    );

    expect(endDate).not.toBeNull();

    expect(getDate(endDate)).toEqual(14);
  });
});
