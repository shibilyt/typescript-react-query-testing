export type FilterType = {
  filter: string;
  date?: {
    start: string;
    end?: string;
  };
};

export enum filterStates {
  all = "all",
  upcoming = "upcoming",
  success = "success",
  failed = "failed",
}

export type LaunchQueryType = {
  upcoming?: Boolean;
  success?: Boolean;
  date_utc?: DateRange;
};

type DateRange = {
  $gte: string;
  $lte?: string;
};

export type LaunchesQueryResponse = {
  docs: SpaceXApiResponse[];
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: Boolean;
  hasNextPage: Boolean;
  prevPage: Boolean | null;
  nextPage: Boolean | null;
};

export type SpaceXApiResponse = {
  id: string;
  flight_number: Number;
  name: string;
  date_utc: string;
  rocket?: { name: string } | null;
  success?: Boolean | null;
  upcoming: Boolean;
  payloads?: { orbit: string | null }[];
  launchpad?: { name: string } | null;
};
