import { ResponseResolver, RestContext, RestRequest } from "msw";
import {
  LaunchesQueryResponse,
  SpaceXApiResponse,
} from "modules/launches/types";

export function launchesResolver(
  launches: SpaceXApiResponse[] | []
): ResponseResolver<RestRequest, RestContext, LaunchesQueryResponse> {
  return (req, res, ctx) => {
    return res(
      ctx.json({
        docs: [...launches],
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
