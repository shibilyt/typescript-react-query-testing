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
  rocket?: Rocket | null;
  success?: Boolean | null;
  failures?:
    | {
        time: number;
        altitude: number | null;
        reason: string;
      }[]
    | null;
  upcoming: Boolean;
  details?: string | null;
  fairings?: {
    reused: Boolean | null;
    recovery_attempt: Boolean | null;
    recovered: Boolean | null;
    ships: string[];
  } | null;
  crew?: string[];
  ships?: string[];
  capsules?: string[];
  payloads?: Payload[];
  launchpad?: Launchpad | null;
  launch_library_id?: string | null;
  cores?:
    | {
        core: string | null;
        flight: number | null;
        gridfins: Boolean | null;
        legs: Boolean | null;
        reused: Boolean | null;
        landing_attempt: Boolean | null;
        landing_success: Boolean | null;
        landing_type: string | null;
        landpad: string | null;
      }[]
    | null;
  links?: {
    patch: {
      small: string | null;
      large: string | null;
    } | null;
    reddit: {
      campaign: string | null;
      launch: string | null;
      media: string | null;
      recovery: string | null;
    } | null;
    flickr: {
      small: string[];
      original: string[];
    } | null;
    presskit: string | null;
    webcast: string | null;
    youtube_id: string | null;
    article: string | null;
    wikipedia: string | null;
  } | null;
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
  } | null;
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
  } | null;
  details: string | null;
  id: string | null;
};

type Rocket = {
  name: string;
  type: string;
  active: Boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  height: {
    meters: number;
    feet: number;
  } | null;
  diameter: {
    meters: number;
    feet: number;
  } | null;
  mass: {
    kg: number;
    lb: number;
  } | null;
  payload_weights: any[];
  first_stage: {
    reusable: Boolean;
    engines: number;
    fuel_amount_tons: number;
    burn_time_sec: number;
    thrust_sea_level: {
      kN: number;
      lbf: number;
    } | null;
    thrust_vacuum: {
      kN: number;
      lbf: number;
    } | null;
  } | null;
  second_stage: {
    reusable: Boolean;
    engines: number;
    fuel_amount_tons: number;
    burn_time_sec: number;
    thrust: {
      kN: number;
      lbf: number;
    } | null;
    payloads: {
      option_1: string;
      composite_fairing: {
        height: {
          meters: number;
          feet: number;
        } | null;
        diameter: {
          meters: number;
          feet: number;
        } | null;
      } | null;
    } | null;
  } | null;
  engines: {
    number: number;
    type: string;
    version: string;
    layout: string;
    isp: {
      sea_level: number;
      vacuum: number;
    } | null;
    engine_loss_max: number;
    propellant_1: string;
    propellant_2: string;
    thrust_sea_level: {
      kN: number;
      lbf: number;
    } | null;
    thrust_vacuum: {
      kN: number;
      lbf: number;
    } | null;
    thrust_to_weight: number;
  } | null;
  landing_legs: {
    number: number;
    material: any;
  } | null;
  flickr_images: string[];
  wikipedia: string;
  description: string;
  id: string;
};
