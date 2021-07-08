import axios from "axiosInstance";
import { useQuery } from "react-query";
import { FilterType } from "../types";
import { getQueryFromFilter } from "../utils";

export const launchesEndPoints = {
  getLaunches: "query",
  getLaunchDetail: (id: string) => `launches/${id}`,
};

export function useGetLaunches({ filter }: { filter: FilterType }) {
  const key = launchesEndPoints.getLaunches;
  return useQuery(key, () =>
    axios.post(key, getQueryFromFilter(filter)).then()
  );
}

export function useGetLaunchDetail(id: string) {
  const key = launchesEndPoints.getLaunchDetail(id);
  return useQuery(key, () => axios.get(key));
}
