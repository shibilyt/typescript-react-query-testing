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

import useQueryParams from "modules/common/hooks/useQueryParams";
import { useGetLaunches } from "./queries";
import { getFormatString, getStatusOfLaunch, getDates } from "./utils";

import {
  DateFilterType,
  filterRanges as dateFilterRanges,
} from "modules/launches/components/dateFilter/types";
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
  const queryParams = useQueryParams();

  // first launch
  // no params set to url
  React.useEffect(() => {
    if (!queryParams.has("page")) {
      queryParams.set("page", "1");
      history.replace(`launches?${queryParams.toString()}`);
    }
    if (!queryParams.has("statusFilter")) {
      queryParams.set("statusFilter", filterStates.all);
      history.replace(`launches?${queryParams.toString()}`);
    }
    if (!queryParams.has("dateFilter") && !queryParams.has("startDate")) {
      queryParams.set("dateFilter", dateFilterRanges.pastSixMonths);
      history.replace(`launches?${queryParams.toString()}`);
    }
  }, [history, queryParams]);

  const [statusFilter, setStatusFilter] = React.useState(
    () => queryParams.get("statusFilter") || filterStates.all
  );

  const [dateFilter, setDateFilter] = React.useState<DateFilterType>({
    startDate: null,
    endDate: null,
  });

  const [dateFilterRange, setDateFilterRange] = React.useState(() => {
    if (queryParams.get("dateFilter")) return queryParams.get("dateFilter");
    return dateFilterRanges.pastSixMonths;
  });

  const [page, setPage] = React.useState(() => {
    if (queryParams.get("page"))
      return +(queryParams.get("page") as string | number) - 1;
    return 0;
  });

  // to check if dateRange is changed between renders
  const prevDateRange = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (
      queryParams.has("dateFilter") &&
      queryParams.get("dateFilter") !== prevDateRange.current
    ) {
      prevDateRange.current = queryParams.get("dateFilter");
      const dateState = getDates(queryParams.get("dateFilter") as string);
      setDateFilter(dateState);
      setDateFilterRange(() => {
        return queryParams.get("dateFilter");
      });
    }
    const queryPage = queryParams.get("page");
    if (queryPage != null && +queryPage >= 1) {
      setPage(+(queryParams.get("page") as string) - 1);
    }
    const queryFilterStatus = queryParams.get("statusFilter");
    if (queryFilterStatus != null) {
      setStatusFilter(queryFilterStatus);
    }
  }, [queryParams]);

  // to check if the page changing is different
  const prevPage = React.useRef(page);
  const prevQueryParam = React.useRef(queryParams.toString());

  const setQueryToUrl = React.useCallback(() => {
    if (prevQueryParam.current !== queryParams.toString()) {
      prevQueryParam.current = queryParams.toString();
      history.push(`launches?${queryParams.toString()}`);
    }
  }, [history, queryParams]);

  const handlePageChange = React.useCallback(
    (changedPage: number) => {
      if (changedPage !== prevPage.current) {
        prevPage.current = changedPage;
        queryParams.set("page", `${changedPage + 1}`);

        setQueryToUrl();
      }
    },
    [queryParams, setQueryToUrl]
  );

  const {
    data: launchData,
    isSuccess,
    isLoading,
    error,
    refetch,
  } = useGetLaunches(
    {
      filter: statusFilter ? statusFilter : filterStates.all,
      ...(dateFilter.startDate
        ? {
            date: {
              start: dateFilter.startDate.toISOString(),
              end: dateFilter.endDate ? dateFilter.endDate.toISOString() : null,
            },
          }
        : {}),
    },
    page ? page + 1 : 1
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

  const handleRowClick = React.useCallback(
    ({ id }: SpaceXApiResponse) => {
      history.push(`/launches/${id}${search}`);
    },
    [history, search]
  );

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
            filterRange={dateFilterRange}
            setFilterRange={(range: string) => {
              queryParams.set("dateFilter", range);
              queryParams.set("page", "1");
              setQueryToUrl();
            }}
          />
          <Select
            options={filterOptions}
            name="filter-select"
            label="filter"
            value={statusFilter}
            onChange={(option) => {
              queryParams.set("statusFilter", option.value);
              queryParams.set("page", "1");
              setQueryToUrl();
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
