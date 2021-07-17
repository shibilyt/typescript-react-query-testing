import * as React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Badge, Box } from "@chakra-ui/react";
import { CellProps, Column } from "react-table";
import format from "date-fns/format";

import Table from "modules/common/components/table";
import Select from "modules/common/components/select";
import DateFilter from "./components/dateFilter";
import { Filter as FilterIcon } from "assets/Filter";
import { useGetLaunches } from "./queries";
import { getFormatString, getStatusOfLaunch } from "./utils";
import useQueryParams from "modules/common/hooks/useQueryParams";

import { filterStates, SpaceXApiResponse } from "./types";
import {
  DateFilterType,
  filterStatuses as dateFilterStatuses,
} from "modules/launches/components/dateFilter/types";

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
      const orbits = value?.map((payload) => payload.orbit as string);
      if (orbits == null) return "";
      const uniqueOrbits = new Set(orbits);

      return Array.from(uniqueOrbits).join(", ");
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
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const queryParams: any = useQueryParams();

  const [statusFilter, setStatusFilter] = React.useState(
    () => queryParams.get("statusFilter") || filterStates.all
  );

  const initialDateFilter = () => {
    if (queryParams.get("dateFilterStatus") == null) {
      return {
        startDate: new Date(queryParams.get("startDate")),
        endDate: queryParams.get("endDate")
          ? new Date(queryParams.get("endDate"))
          : null,
      };
    }
    return {
      startDate: null,
      endDate: null,
    };
  };

  const [dateFilter, setDateFilter] =
    React.useState<DateFilterType>(initialDateFilter);

  const initialDateFilterRange = () => {
    if (queryParams.get("dateFilterStatus"))
      return queryParams.get("dateFilterStatus");
    if (queryParams.get("startDate"))
      return `${queryParams.get("startDate")} - ${
        queryParams.get("endDate") || "Upcoming"
      }`;
    return dateFilterStatuses.pastSixMonths;
  };

  const [dateFilterRange, setDateFilterRange] = React.useState(
    initialDateFilterRange
  );

  React.useEffect(() => {
    let query = `?statusFilter=${statusFilter}`;
    if (Object.values(dateFilterStatuses).includes(dateFilterRange)) {
      query = query + `&dateFilterStatus=${dateFilterRange}`;
    } else {
      const { startDate, endDate } = dateFilter;
      query =
        query +
        `${!!startDate ? `&startDate=${format(startDate, "d MMM yyyy")}` : ""}`;
      query =
        query +
        `${!!endDate ? `&endDate=${format(endDate, "d MMM yyyy")}` : ""}`;
    }

    history.push(query);
  }, [statusFilter, history, dateFilterRange, dateFilter]);

  const {
    data: launchData,
    isLoading,
    error,
    refetch,
  } = useGetLaunches({
    filter: statusFilter,
    ...(dateFilter.startDate
      ? {
          date: {
            start: dateFilter.startDate.toISOString(),
            end: dateFilter.endDate?.toISOString(),
          },
        }
      : {}),
  });

  const data = React.useMemo(
    () => (launchData ? launchData.docs : []),
    [launchData]
  );

  return (
    <Box my={12}>
      <Box mb={12} display="flex" justifyContent="space-between">
        <DateFilter
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          filterRange={dateFilterRange}
          setFilterRange={setDateFilterRange}
        />
        <Select
          options={filterOptions}
          name="filter-select"
          label="filter"
          value={statusFilter}
          onChange={(option) => {
            setStatusFilter(option.value);
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
