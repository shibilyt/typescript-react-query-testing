import axios from "axiosInstance";
import { useQuery } from "react-query";
import { filterStates, FilterType, LaunchesQueryResponse } from "../types";
import { getQueryFromFilter } from "../utils";

export const launchesEndPoints = {
  getLaunches: "launches/query" as const,
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
            {
              path: "rocket",
              select: ["name", "type", "company", "country"],
            },
            { path: "payloads", select: ["orbit", "type"] },
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
            "links.patch.small",
            "links.wikipedia",
            "links.youtube_id",
            "links.article",
            "details",
          ],
          sort: {
            flight_number: "asc",
          },
          page,
          limit: 12,
        },
      })
      .then((response) => response.data)
  );
}
