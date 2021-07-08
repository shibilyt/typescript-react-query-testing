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
