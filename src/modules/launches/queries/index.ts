import axios from "axiosInstance";
import { useQuery } from "react-query";
import { FilterType, LaunchesQueryResponse } from "../types";
import { getQueryFromFilter } from "../utils";

export const launchesEndPoints = {
  getLaunches: "launches/query" as const,
  getLaunchDetail: (id: string) => `launches/${id}`,
};

export function useGetLaunches({ filter = {} }: { filter: FilterType }) {
  const key = launchesEndPoints.getLaunches;
  return useQuery<LaunchesQueryResponse>(key, () =>
    axios
      .post(key, {
        ...getQueryFromFilter(filter),
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
