import { FilterType, LaunchQueryType } from "../types";

export function getQueryFromFilter(filter: FilterType) {
  const query: LaunchQueryType = {};
  if (filter.upcoming) query.upcoming = true;
  if (filter.past) query.past = true;
  if (filter.status) query.status = filter.status;
  if (filter.date)
    query.date_utc = {
      $gte: filter.date.start,
      $lte: filter.date.end,
    };

  return {
    query,
  };
}
