import { TableOptions } from "react-table";

export interface TableProperties<T extends Record<string, unknown>>
  extends TableOptions<T> {
  name: string;
}

export enum tableStates {
  loading = "loading",
  empty = "empty",
  haveData = "haveData",
}
