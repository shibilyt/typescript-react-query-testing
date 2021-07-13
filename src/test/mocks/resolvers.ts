import { ResponseResolver, RestContext, RestRequest } from "msw";
import {
  LaunchesQueryResponse,
  SpaceXApiResponse,
  LaunchQueryType,
} from "modules/launches/types";

export function launchesResolver(
  launches: SpaceXApiResponse[] | []
): ResponseResolver<
  RestRequest<{ query: LaunchQueryType; options: any }>,
  RestContext,
  LaunchesQueryResponse
> {
  return (req, res, ctx) => {
    let query = req.body?.query;
    let resolvedLaunches = [...launches];
    if (typeof query?.success === "boolean") {
      resolvedLaunches = resolvedLaunches.filter(
        (launch) => launch.success !== null && launch.success === query.success
      );
    }
    if (query?.upcoming) {
      resolvedLaunches = resolvedLaunches.filter((launch) => launch.upcoming);
    }
    return res(
      ctx.json({
        docs: [...resolvedLaunches],
        totalDocs: 0,
        offset: 0,
        limit: 12,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      })
    );
  };
}
