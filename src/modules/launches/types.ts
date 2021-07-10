export type FilterType = {
  upcoming?: boolean;
  past?: boolean;
  status?: string;
  date?: {
    start: string;
    end: string;
  };
};

export type LaunchQueryType = {
  upcoming?: boolean;
  past?: boolean;
  status?: string;
  date_utc?: DateRange;
};

type DateRange = {
  $gte?: string;
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
  date_unix: number;
  date_local: string;
  date_precision: "half" | "quarter" | "year" | "month" | "day" | "hour";
  static_fire_date_utc?: string | null;
  static_fire_date_unix?: number | null;
  tdb?: Boolean;
  tbd?: Boolean;
  net?: Boolean;
  window?: number | null;
  rocket?: string | null;
  success?: Boolean | null;
  failures?: {
    time: number;
    altitude: number | null;
    reason: string;
  }[];
  upcoming: Boolean;
  details?: string | null;
  fairings?: {
    reused: Boolean | null;
    recovery_attempt: Boolean | null;
    recovered: Boolean | null;
    ships: string[];
  };
  crew?: string[];
  ships?: string[];
  capsules?: string[];
  payloads?: Payload[];
  launchpad?: Launchpad | null;
  launch_library_id?: string | null;
  cores?: {
    core: string | null;
    flight: number | null;
    gridfins: Boolean | null;
    legs: Boolean | null;
    reused: Boolean | null;
    landing_attempt: Boolean | null;
    landing_success: Boolean | null;
    landing_type: string | null;
    landpad: string | null;
  }[];
  links?: {
    patch: {
      small: string | null;
      large: string | null;
    };
    reddit: {
      campaign: string | null;
      launch: string | null;
      media: string | null;
      recovery: string | null;
    };
    flickr: {
      small: string[];
      original: string[];
    };
    presskit: string | null;
    webcast: string | null;
    youtube_id: string | null;
    article: string | null;
    wikipedia: string | null;
  };
  auto_update?: Boolean;
};

type Payload = {
  dragon: {
    capsule: string | null;
    mass_returned_kg: number | null;
    mass_returned_lbs: number | null;
    flight_time_sec: string | number | null;
    manifest: string | null;
    water_landing: Boolean | null;
    land_landing: Boolean | null;
  };
  name: string | null;
  type: string | null;
  reused: boolean | null;
  launch: string | null;
  customers: string[] | null;
  norad_ids: number[] | null;
  nationalities: string[] | null;
  manufacturers: string[] | null;
  mass_kg: number | null;
  mass_lbs: number | null;
  orbit: string | null;
  reference_system: string | null;
  regime: string | null;
  longitude: number | null;
  semi_major_axis_km: number | null;
  eccentricity: number | null;
  periapsis_km: number | null;
  apoapsis_km: number | null;
  inclination_deg: number | null;
  period_min: number | null;
  lifespan_years: number | null;
  epoch: string | null;
  mean_motion: number | null;
  raan: number | null;
  arg_of_pericenter: number | null;
  mean_anomaly: number | null;
  id: string;
};

type Launchpad = {
  name: string | null;
  full_name: string | null;
  status:
    | "active"
    | "inactive"
    | "unknown"
    | "retired"
    | "lost"
    | "under construction";

  locality: string | null;
  region: string | null;
  timezone: string | null;
  latitude: number | null;
  longitude: number | null;
  launch_attempts: number;
  launch_successes: number;
  rockets: string[] | null;
  launches: string[] | null;
  images: {
    large: string[] | null;
  };
  details: string | null;
  id: string | null;
};
