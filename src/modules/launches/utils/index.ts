import { getDateMonthAndYear } from "@datepicker-react/hooks";
import addDays from "date-fns/addDays";
import addMonths from "date-fns/addMonths";
import addYears from "date-fns/addYears";
import { filterRanges } from "../components/dateFilter/types";
import {
  FilterType,
  filterStates,
  LaunchQueryType,
  SpaceXApiResponse,
} from "../types";

export function getQueryFromFilter({ filter, date }: FilterType) {
  const query: LaunchQueryType = {};
  if (filter === filterStates.upcoming) query.upcoming = true;
  if (filter === "success") query.success = true;
  if (filter === "failed") query.success = false;
  if (date)
    query.date_utc = {
      $gte: date.start,
      ...(date.end ? { $lte: date.end } : {}),
    };

  return {
    query,
  };
}

export function getStatusOfLaunch(launchData: SpaceXApiResponse) {
  if (launchData.upcoming) return "Upcoming";
  if (launchData.success) {
    return "Success";
  }
  return "Failed";
}

export function getFormatString(status: string) {
  if (status === "Failed") return "dd MMMM yyyy 'at' HH:mm";
  return "dd MMMM yyyy HH:mm";
}

export function getPastWeek() {
  const endDate = new Date();
  return {
    startDate: addDays(endDate, -7),
    endDate,
  };
}

export function getPastMonth() {
  const endDate = new Date();
  return {
    startDate: addMonths(endDate, -1),
    endDate,
  };
}

export function getPastThreeMonths() {
  const endDate = new Date();
  return {
    startDate: addMonths(endDate, -3),
    endDate,
  };
}

export function getPastSixMonths() {
  const endDate = new Date();
  return {
    startDate: addMonths(endDate, -6),
    endDate,
  };
}

export function getPastYear() {
  const endDate = new Date();
  return {
    startDate: addYears(endDate, -1),
    endDate,
  };
}

export function getPastTwoYears() {
  const endDate = new Date();
  return {
    startDate: addYears(endDate, -2),
    endDate,
  };
}

export function getDates(range: string) {
  switch (range) {
    case filterRanges.pastWeek:
      return getPastWeek();
    case filterRanges.pastMonth:
      return getPastMonth();
    case filterRanges.pastThreeMonths:
      return getPastThreeMonths();
    case filterRanges.pastSixMonths:
      return getPastSixMonths();
    case filterRanges.pastYear:
      return getPastYear();
    case filterRanges.pastTwoYear:
      return getPastTwoYears();
    default: {
      const [start, end] = range.split("-").map((d) => d.trim());

      if (end == null || end === "Upcoming") {
        return {
          startDate: new Date(start),
          endDate: null,
        };
      }
      return {
        startDate: new Date(start),
        endDate: new Date(end),
      };
    }
  }
}

export function getActiveMonths(filterRange: string) {
  switch (filterRange) {
    case filterRanges.pastWeek:
    case filterRanges.pastMonth:
    case filterRanges.pastThreeMonths:
    case filterRanges.pastSixMonths:
    case filterRanges.pastYear:
    case filterRanges.pastTwoYear: {
      const dates = getDates(filterRange);
      return [
        getDateMonthAndYear(dates.startDate as Date),
        getDateMonthAndYear(dates.endDate as Date),
      ];
    }
    default: {
      const dates = getDates(filterRange);
      if (!dates.endDate) {
        return [
          getDateMonthAndYear(dates.startDate),
          getDateMonthAndYear(addMonths(new Date(), 1)),
        ];
      }
      return [getDateMonthAndYear(dates.startDate)];
    }
  }
}
