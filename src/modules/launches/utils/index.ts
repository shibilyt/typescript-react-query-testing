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
      $lte: date.end,
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
