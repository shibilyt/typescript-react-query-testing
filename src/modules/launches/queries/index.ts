import axios from "axiosInstance";
import { useQuery } from "react-query";
import { filterStates, FilterType, LaunchesQueryResponse } from "../types";
import { getQueryFromFilter } from "../utils";

export const launchesEndPoints = {
  getLaunches: "launches/query" as const,
  getLaunchDetail: (id: string) => `launches/${id}`,
};

export function useGetLaunches(
  launchFilter: FilterType = { filter: filterStates.all },
  page: number
) {
  const key = launchesEndPoints.getLaunches;
  return useQuery<LaunchesQueryResponse>([key, launchFilter, page], () =>
    axios
      .post(key, {
        ...getQueryFromFilter(launchFilter),
        options: {
          populate: [
            { path: "launchpad", select: "name" },
            { path: "rocket", select: "name" },
            { path: "payloads", select: "orbit" },
          ],
          select: [
            "id",
            "name",
            "flight_number",
            "date_utc",
            "launchpad",
            "payloads",
            "success",
            "upcoming",
            "rocket",
          ],
          sort: {
            flight_number: "asc",
          },
          page,
        },
      })
      .then((response) => response.data)
  );
}

export function useGetLaunchDetail(id: string) {
  const key = launchesEndPoints.getLaunchDetail(id);
  return useQuery(key, () => axios.get(key));
}
