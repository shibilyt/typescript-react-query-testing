import { screen, within } from "@testing-library/react";
import MonthYearSelect from "..";
import { render } from "test/test-utils";
import userEvent from "@testing-library/user-event";

describe("MonthYearSelect", () => {
  test("shows all months on open", () => {
    let month = 2;
    render(
      <MonthYearSelect
        name="month"
        type="month"
        value={month}
        onChange={(option) => (month = option.value)}
        getNext={() => {
          if (month === 11) {
            month = 1;
          }
          month++;
        }}
        getPrev={() => {
          if (month === 0) {
            month = 11;
          }
          month--;
        }}
      />
    );

    const selectButton = screen.getByRole("button");
    expect(selectButton).toHaveTextContent(/march/i);

    userEvent.click(selectButton);
    expect(screen.getAllByRole("option")).toHaveLength(12);
    userEvent.click(screen.getByRole("option", { name: /june/i }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(month).toEqual(5);
  });

  test("up and down arrow moves months to prev and next options", () => {
    let month = 0;
    render(
      <MonthYearSelect
        name="month"
        type="month"
        value={month}
        onChange={(option) => (month = option.value)}
        getNext={() => {
          if (month === 11) {
            month = 1;
          }
          month++;
        }}
        getPrev={() => {
          if (month === 0) {
            month = 11;
          }
          month--;
        }}
      />
    );

    const upArrow = screen.getByTestId("select-prev");
    const downArrow = screen.getByTestId("select-next");

    userEvent.click(downArrow);
    expect(month).toEqual(1);
    userEvent.click(upArrow);
    expect(month).toEqual(0);
  });

  test("up arrow when at january will move the month to dec of prev year", () => {
    let month = 0;
    let year = 2021;
    render(
      <MonthYearSelect
        name="month"
        type="month"
        value={month}
        onChange={(option) => (month = option.value)}
        getNext={() => {
          if (month === 11) {
            month = 1;
            year++;
          } else {
            month++;
          }
        }}
        getPrev={() => {
          if (month === 0) {
            month = 11;
            year--;
          } else month--;
        }}
      />
    );

    const upArrow = screen.getByTestId("select-prev");
    const downArrow = screen.getByTestId("select-next");

    userEvent.click(upArrow);
    expect(month).toEqual(11);
    expect(year).toEqual(2020);
    userEvent.click(downArrow);
    expect(month).toEqual(1);
    expect(year).toEqual(2021);
  });

  test(`in start month, can't select months >= end month OR vice versa in end month`, () => {
    let startMonth = 0;
    let startYear = 2021;
    let endMonth = 1;
    let endYear = 2021;
    render(
      <>
        <MonthYearSelect
          name="start-month"
          type="month"
          value={startMonth}
          disableFrom={startYear === endYear ? endMonth : false}
          onChange={(option) => (startMonth = option.value)}
          getNext={() => {
            if (startMonth === 11) {
              startMonth = 1;
              startYear++;
            } else {
              startMonth++;
            }
          }}
          getPrev={() => {
            if (startMonth === 0) {
              startMonth = 11;
              startYear--;
            } else startMonth--;
          }}
        />
        <MonthYearSelect
          name="start-year"
          type="year"
          value={startYear}
          disableFrom={endYear}
          onChange={(option) => (startYear = option.value)}
          getNext={() => {
            startYear++;
          }}
          getPrev={() => {
            startYear--;
          }}
        />
        <MonthYearSelect
          name="end-month"
          type="month"
          value={endMonth}
          disableTo={startYear === endYear ? startMonth : false}
          onChange={(option) => (endMonth = option.value)}
          getNext={() => {
            if (endMonth === 11) {
              endMonth = 1;
              endYear++;
            } else {
              endMonth++;
            }
          }}
          getPrev={() => {
            if (endMonth === 0) {
              endMonth = 11;
              endYear--;
            } else endMonth--;
          }}
        />
        <MonthYearSelect
          name="end-year"
          type="year"
          value={endYear}
          disableTo={startYear}
          onChange={(option) => (endYear = option.value)}
          getNext={() => {
            endYear++;
          }}
          getPrev={() => {
            endYear--;
          }}
        />
      </>
    );

    const startMonthSelect = screen.getByRole("button", { name: /january/i });

    const withinStartMonth = within(startMonthSelect);
    const downArrow = withinStartMonth.getByTestId("select-next");
    userEvent.click(downArrow);

    expect(startMonth).toEqual(0);
    // const upArrow = screen.getByTestId("select-prev");
    // const downArrow = screen.getByTestId("select-next");

    // userEvent.click();
    // expect(month).toEqual(1);
    // expect(year).toEqual(2021);
  });
});
