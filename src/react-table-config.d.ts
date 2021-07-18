import {
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
} from "react-table";

declare module "react-table" {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  export interface TableOptions<
    D extends Record<string, unknown>
  > extends UsePaginationOptions<D>,
      // note that having Record here allows you to add anything to the options, this matches the spirit of the
      // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
      // feature set, this is a safe default.
      Record<string, any> {}

  export interface Hooks<
    D extends Record<string, unknown> = Record<string, unknown>
  > {}

  export interface TableInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UsePaginationInstanceProps<D> {}

  export interface TableState<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UsePaginationState<D> {}

  export interface ColumnInterface<
    D extends Record<string, unknown> = Record<string, unknown>
  > {}

  export interface ColumnInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > {}

  export interface Cell<
    D extends Record<string, unknown> = Record<string, unknown>,
    V = any
  > {}

  export interface Row<
    D extends Record<string, unknown> = Record<string, unknown>
  > {}
}
