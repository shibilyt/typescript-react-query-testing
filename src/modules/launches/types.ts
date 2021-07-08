export type FilterType = {
  upcoming?: boolean;
  past?: boolean;
  status?: string;
  date?: {
    start: string;
    end: string;
  };
};
