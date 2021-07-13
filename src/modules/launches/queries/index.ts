import axios from "axiosInstance";
import { useQuery } from "react-query";
import { filterStates, FilterType, LaunchesQueryResponse } from "../types";
import { getQueryFromFilter } from "../utils";

export const launchesEndPoints = {
  getLaunches: "launches/query" as const,
  getLaunchDetail: (id: string) => `launches/${id}`,
};

export function useGetLaunches(
  launchFilter: FilterType = { filter: filterStates.all }
) {
  const key = launchesEndPoints.getLaunches;
  return useQuery<LaunchesQueryResponse>([key, launchFilter], () =>
    axios
      .post(key, {
        ...getQueryFromFilter(launchFilter),
        options: {
          populate: ["launchpad", "rocket", "payloads"],
        },
      })
      .then((response) => response.data)
  );
}

export function useGetLaunchDetail(id: string) {
  const key = launchesEndPoints.getLaunchDetail(id);
  return useQuery(key, () => axios.get(key));
}
