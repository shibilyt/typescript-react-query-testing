import * as React from "react";
import { Box, Text } from "@chakra-ui/react";
import { FirstDayOfWeek, useMonth } from "@datepicker-react/hooks";
import Day from "../day";

interface MonthProps {
  year: number;
  month: number;
  firstDayOfWeek: FirstDayOfWeek;
}

function Month({ year, month, firstDayOfWeek }: MonthProps) {
  const { days, weekdayLabels, monthLabel } = useMonth({
    year,
    month,
    firstDayOfWeek,
  });

  return (
    <Box>
      <Box textAlign="center" mx={0} mt={0} mb={4}>
        <Text as="span">{monthLabel}</Text>
      </Box>
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
