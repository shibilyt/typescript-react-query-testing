import { FilterType } from "../types";

export function getQueryFromFilter(filter: FilterType) {
  return {
    query: {
      upcoming: filter.upcoming,
      past: filter.past,
      status: filter.status,
      date_utc: {
        $gte: filter.date.start,
        $lte: filter.date.end,
      },
    },
  };
}
