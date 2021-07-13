import { FilterType, LaunchQueryType, SpaceXApiResponse } from "../types";

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
