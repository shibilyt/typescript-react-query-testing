import { ResponseResolver, RestContext, RestRequest } from "msw";
import {
  LaunchesQueryResponse,
  SpaceXApiResponse,
  LaunchQueryType,
} from "modules/launches/types";
import isAfter from "date-fns/isAfter";
import isSameDay from "date-fns/isSameDay";
import isBefore from "date-fns/isBefore";

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
    if (query && query.date_utc) {
      resolvedLaunches = resolvedLaunches.filter((launch) => {
        if (!query.date_utc?.$gte) return false;
        const gte = new Date(query.date_utc.$gte);
        const date = new Date(launch.date_utc);
        const isGte = isAfter(date, gte) || isSameDay(date, gte);
        if (!query.date_utc?.$lte) {
          return isGte;
        }
        const lte = new Date(query.date_utc.$lte);
        const isLte = isBefore(date, lte) || isSameDay(date, lte);
        return isGte && isLte;
      });
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
