import { rest } from "msw";
import { launchesResolver } from "./resolvers";
import { mockData } from "./_data";
import { launchesEndPoints } from "modules/launches/queries";
import { LaunchQueryType } from "modules/launches/types";

export const handlers = [
  rest.post<{ query: LaunchQueryType; options: any }>(
    process.env.REACT_APP_BASE_URL + launchesEndPoints.getLaunches,
    launchesResolver(mockData)
  ),
];
