import * as React from "react";
import { useParams } from "react-router-dom";
import { Badge, Box } from "@chakra-ui/react";
import { CellProps, Column } from "react-table";
import format from "date-fns/format";

import Table from "modules/common/components/table";
import Select from "modules/common/components/select";
import { Filter as FilterIcon } from "assets/Filter";
import { useGetLaunches } from "./queries";
import { getFormatString, getStatusOfLaunch } from "./utils";

import { filterStates, SpaceXApiResponse } from "./types";

const columns: Column<SpaceXApiResponse>[] = [
  {
    Header: "No:",
    accessor: "flight_number",
  },
  {
    Header: "Launched (UTC)",
    accessor: "date_utc",
    Cell: ({
      value,
      row: { original: launchData },
    }: CellProps<SpaceXApiResponse, SpaceXApiResponse["date_utc"]>) => {
      const date = new Date(value);
      const status = getStatusOfLaunch(launchData);
      const formatString = getFormatString(status);
      return format(date, formatString);
    },
  },
  {
    Header: "Location",
    accessor: "launchpad.name" as keyof SpaceXApiResponse["launchpad"],
  },
  {
    Header: "Mission",
    accessor: "name",
  },
  {
    Header: "Orbit",
    accessor: "payloads",
    Cell: ({
      value,
    }: CellProps<SpaceXApiResponse, SpaceXApiResponse["payloads"]>) => {
      return value?.map((payload) => payload.orbit).join(", ");
    },
  },
  {
    Header: "Launch Status",
    accessor: "success",
    Cell: ({
      row: { original: launchData },
    }: CellProps<SpaceXApiResponse, SpaceXApiResponse["success"]>) => {
      const status = getStatusOfLaunch(launchData);
      const statusBadgeEnum: Record<string, string> = {
        Upcoming: "orange",
        Success: "green",
        Failed: "red",
      };
      return (
        <Badge
          display="inline"
          fontSize="xs"
          colorScheme={statusBadgeEnum[status]}
          px={3}
          py={1}
          borderRadius="2xl"
          textTransform="capitalize"
          fontWeight="medium"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    Header: "Rocket",
    accessor: "rocket.name" as keyof SpaceXApiResponse["rocket"],
  },
];

const filterOptions = [
  { label: "All Launches", value: filterStates.all },
  { label: "Upcoming Launches", value: filterStates.upcoming },
  { label: "Successful Launches", value: filterStates.success },
  { label: "Failed Launches", value: filterStates.failed },
];

export default function Launches() {
  const { id } = useParams<{ id: string }>();
  console.log(id);

  const [filterSelected, setFilterSelected] = React.useState(filterStates.all);
  const {
    data: launchData,
    isLoading,
    error,
    refetch,
  } = useGetLaunches({
    filter: filterSelected,
  });

  const data = React.useMemo(
    () => (launchData ? launchData.docs : []),
    [launchData]
  );

  return (
    <Box my={12}>
      <Box mb={12} display="flex" justifyContent="flex-end">
        <Select
          options={filterOptions}
          name="filter-select"
          label="filter"
          value={filterSelected}
          onChange={(option) => {
            setFilterSelected(option.value);
          }}
          startIcon={<FilterIcon />}
        />
      </Box>
      <Table<SpaceXApiResponse>
        name="launches-table"
        columns={columns}
        data={data}
        emptyMessage={"No results found for the specified filter"}
        isLoading={isLoading}
        error={error}
        resetErrorHandler={refetch}
      />
    </Box>
  );
}
