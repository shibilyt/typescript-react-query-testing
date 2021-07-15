import * as React from "react";
import { Box, chakra, HStack } from "@chakra-ui/react";
import {
  FirstDayOfWeek,
  getDateMonthAndYear,
  MonthType,
  useMonth,
} from "@datepicker-react/hooks";
import Day from "../day";
import MonthYearSelect from "../monthYearSelect";
import { setMonth, setYear } from "date-fns/esm";
import datepickerContext from "../../context";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface MonthProps {
  index: number;
}

function Month({ index }: MonthProps) {
  const { activeMonths, setActiveMonths } = React.useContext(datepickerContext);
  const activeMonth = activeMonths[index];
  const { month, year } = activeMonth;

  const { days, weekdayLabels } = useMonth({
    year: year,
    month: month,
    firstDayOfWeek: 0,
  });

  const isSameYear = activeMonths[0].year === activeMonths[1].year;

  const disableMonthFrom = React.useMemo(() => {
    if (isSameYear && index === 0) {
      return activeMonths[1].month;
    }
    return false;
  }, [activeMonths, index, isSameYear]);

  const disableMonthTo = React.useMemo(() => {
    if (isSameYear && index === 1) {
      return activeMonths[0].month;
    }
    return false;
  }, [activeMonths, index, isSameYear]);

  const disableYearFrom = React.useMemo(() => {
    if (index === 0) {
      return activeMonths[1].year;
    }
    return false;
  }, [activeMonths, index]);

  const disableYearTo = React.useMemo(() => {
    if (index === 1) {
      return activeMonths[0].year;
    }
    return false;
  }, [activeMonths, index]);

  const handleMonthChange = (monthChanged: number) => {
    setActiveMonths((draft) => {
      draft[index].month = monthChanged;
      draft[index].date = setMonth(draft[index].date, monthChanged);
    });
  };

  const handleYearChange = (yearChanged: number, _activeMonth: MonthType) => {
    setActiveMonths((draft) => {
      draft[index] = getDateMonthAndYear(
        setYear(_activeMonth.date, yearChanged)
      );
    });
  };

  const handleMoveToNextYear = (_activeMonth: MonthType) => {
    const { year, date } = _activeMonth;
    let updatedDate = setMonth(date, 0);
    setActiveMonths((draft) => {
      draft[index] = getDateMonthAndYear(setYear(updatedDate, year + 1));
    });
  };

  const handleMoveToPrevYear = (_activeMonth: MonthType) => {
    const { year, date } = _activeMonth;
    let updatedDate = setMonth(date, 11);
    setActiveMonths((draft) => {
      draft[index] = getDateMonthAndYear(setYear(updatedDate, year - 1));
    });
  };

  return (
    <Box>
      <HStack
        mb={2}
        pb={2}
        borderBottom="1px"
        borderBottomColor="gray.300"
        justifyContent={index === 0 ? "flex-start" : "flex-end"}
        sx={{
          " > :not(button)": {
            display: "flex",
            justifyContent: index === 0 ? "flex-start" : "flex-end",
          },
        }}
      >
        {index === 0 ? (
          <chakra.button>
            <ChevronLeftIcon />
          </chakra.button>
        ) : null}
        <MonthYearSelect
          name="starting-month"
          type="month"
          disableFrom={disableMonthFrom}
          disableTo={disableMonthTo}
          value={activeMonths[index].month}
          onChange={(option) => handleMonthChange(option.value)}
          getNext={() => {
            if (month === 11) {
              handleMoveToNextYear(activeMonth);
            } else {
              handleMonthChange(month + 1);
            }
          }}
          getPrev={() => {
            if (month === 0) {
              handleMoveToPrevYear(activeMonth);
            } else {
              handleMonthChange(month - 1);
            }
          }}
        />
        <MonthYearSelect
          name="starting-year"
          type="year"
          value={activeMonth.year}
          disableFrom={disableYearFrom}
          disableTo={disableYearTo}
          onChange={(option) => handleYearChange(option.value, activeMonth)}
          getNext={() => {
            handleYearChange(year + 1, activeMonth);
          }}
          getPrev={() => {
            handleYearChange(year - 1, activeMonth);
          }}
        />
        {index === 1 ? (
          <chakra.button>
            <ChevronRightIcon />
          </chakra.button>
        ) : null}
      </HStack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          justifyContent: "center",
          marginBottom: "10px",
          fontWeight: "600",
        }}
      >
        {weekdayLabels.map((dayLabel) => (
          <Box textAlign="center" key={dayLabel}>
            {dayLabel}
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          justifyContent: "center",
        }}
      >
        {days.map((day, index) => {
          if (typeof day === "object") {
            return (
              <Day
                date={day.date}
                key={day.date.toString()}
                dayLabel={day.dayLabel}
              />
            );
          }

          return <Box key={index} />;
        })}
      </Box>
    </Box>
  );
}

export default Month;
