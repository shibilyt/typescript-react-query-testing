import * as React from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Badge, Box } from "@chakra-ui/react";
import { CellProps, Column } from "react-table";
import format from "date-fns/format";

import Table from "modules/common/components/table";
import Select from "modules/common/components/select";
import DateFilter from "./components/dateFilter";
import LaunchDetail from "./components/launchDetail";

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
          fontWeight="600"
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
  const { search } = useLocation();
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

  const handleDateFilterChange = (date: DateFilterType) => {
    setPage(0);
    setDateFilter(date);
  };

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

  const [page, setPage] = React.useState(() => {
    return +queryParams.get("page") - 1 ?? 0;
  });

  const handlePageChange = React.useCallback((page: number) => {
    setPage(page);
  }, []);

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
    query = query + `&page=${page + 1}`;

    history.push(query);
  }, [statusFilter, history, dateFilterRange, dateFilter, page]);

  const {
    data: launchData,
    isSuccess,
    isLoading,
    error,
    refetch,
  } = useGetLaunches(
    {
      filter: statusFilter,
      ...(dateFilter.startDate
        ? {
            date: {
              start: dateFilter.startDate.toISOString(),
              end: dateFilter.endDate?.toISOString(),
            },
          }
        : {}),
    },
    page + 1
  );

  const data = React.useMemo(
    () => (launchData ? launchData.docs : []),
    [launchData]
  );

  const dataLookupTable = React.useRef<Record<
    string,
    SpaceXApiResponse
  > | null>();

  React.useEffect(() => {
    if (launchData?.docs && launchData.docs.length > 0) {
      const lookupTable: Record<string, SpaceXApiResponse> = {};
      launchData.docs.forEach((launch) => {
        lookupTable[launch.id] = launch;
      });
      dataLookupTable.current = lookupTable;
    }
  }, [launchData]);

  const handleRowClick = ({ id }: SpaceXApiResponse) => {
    history.push(`/launches/${id}${search}`);
  };

  const handleDetailModalClose = () => {
    history.push(`/launches${search}`);
  };

  const lookupTable = React.useMemo(
    () =>
      launchData
        ? launchData?.docs.reduce<Record<string, SpaceXApiResponse>>(
            (lookup, launch) => {
              return {
                ...lookup,
                [launch.id]: launch,
              };
            },
            {}
          )
        : {},
    [launchData]
  );

  return (
    <>
      <Box my={12}>
        <Box mb={12} display="flex" justifyContent="space-between">
          <DateFilter
            dateFilter={dateFilter}
            setDateFilter={handleDateFilterChange}
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
              setPage(0);
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
          page={page}
          pageCount={launchData?.totalPages || 1}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      </Box>
      {isSuccess &&
      launchData?.docs &&
      launchData.docs.length > 0 &&
      lookupTable[id] ? (
        <LaunchDetail
          data={lookupTable[id]}
          isOpen={!!id}
          handleClose={handleDetailModalClose}
        />
      ) : null}
    </>
  );
}
