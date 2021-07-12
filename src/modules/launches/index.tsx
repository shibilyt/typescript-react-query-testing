import * as React from "react";
import { useParams } from "react-router-dom";

import Table from "modules/common/components/table";
import { SpaceXApiResponse } from "./types";
import { CellProps, Column } from "react-table";
import { useGetLaunches } from "./queries";
import { getStatusOfLaunch } from "./utils";
import { Badge } from "@chakra-ui/react";

const columns: Column<SpaceXApiResponse>[] = [
  {
    Header: "No:",
    accessor: "flight_number",
  },
  {
    Header: "Launched (UTC)",
    accessor: "date_utc",
    Cell: (
      cell: CellProps<SpaceXApiResponse, SpaceXApiResponse["date_utc"]>
    ) => {
      return cell.value;
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
      cell: { value },
    }: CellProps<SpaceXApiResponse, SpaceXApiResponse["payloads"]>) => {
      return value?.map((payload) => payload.orbit).join(", ");
    },
  },
  {
    Header: "Launch Status",
    accessor: "success",
    Cell: (
      cell: CellProps<SpaceXApiResponse, SpaceXApiResponse["success"]>
    ) => {
      const {
        row: { original: launchData },
      } = cell;
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

export default function Launches() {
  const { id } = useParams<{ id: string }>();
  console.log(id);

  const filter = {};
  const { data: launchData, isLoading } = useGetLaunches({ filter });

  const data = React.useMemo(
    () => (launchData ? launchData.docs : []),
    [launchData]
  );
  return (
    <>
      <div>
        <Table<SpaceXApiResponse>
          name="launches-table"
          columns={columns}
          data={data}
          emptyMessage={"No results found for the specified filter"}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
