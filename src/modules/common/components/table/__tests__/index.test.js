import { screen, waitFor, within } from "@testing-library/react";
import { render } from "test/test-utils";
import Table from "..";

const columns = [
  {
    Header: "No:",
    accessor: "flight_number",
  },
  {
    Header: "Launched (UTC)",
    accessor: "date_utc",
  },
  {
    Header: "Location",
    accessor: "launchpad",
  },
  {
    Header: "Mission",
    accessor: "name",
  },
];
const data = [
  {
    success: false,
    launchpad: "5e9e4502f5090995de566f86",
    flight_number: 1,
    name: "FalconSat",
    date_utc: "2006-03-24T22:30:00.000Z",
  },
  {
    success: false,
    launchpad: "5e9e4502f5090995de566f86",
    flight_number: 2,
    name: "DemoSat",
    date_utc: "2007-03-21T01:10:00.000Z",
  },
  {
    success: false,
    launchpad: "5e9e4502f5090995de566f86",
    flight_number: 3,
    name: "Trailblazer",
    date_utc: "2008-08-03T03:34:00.000Z",
  },
];

test("table renders with proper headers and data", () => {
  render(<Table data={data} columns={columns} name="table" />);

  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getAllByRole("columnheader")).toHaveLength(4);

  columns.forEach((column) => {
    expect(
      screen.getByRole("columnheader", { name: column.Header })
    ).toBeInTheDocument();
  });

  data.forEach(({ name, flight_number, date_utc, launchpad }) => {
    const row = screen.getByText(flight_number).closest("tr");
    const utils = within(row);
    expect(utils.getByText(flight_number)).toBeInTheDocument();
    expect(utils.getByText(name)).toBeInTheDocument();
    expect(utils.getByText(date_utc)).toBeInTheDocument();
    expect(utils.getByText(launchpad)).toBeInTheDocument();
  });
});

test("table loading is rendered when loading", () => {
  const data = [
    {
      name: "FalconSat",
      date_utc: "2006-03-24T22:30:00.000Z",
    },
    {
      name: "DemoSat",
      date_utc: "2007-03-21T01:10:00.000Z",
    },
    {
      name: "Trailblazer",
      date_utc: "2008-08-03T03:34:00.000Z",
    },
  ];

  render(<Table data={data} columns={columns} isLoading={true} name="table" />);
  expect(screen.queryByTestId("loading")).toBeInTheDocument();
});

test("table error is captured by ErrorBoudary", () => {
  const data = [
    {
      name: "FalconSat",
      date_utc: "2006-03-24T22:30:00.000Z",
    },
    {
      name: "DemoSat",
      date_utc: "2007-03-21T01:10:00.000Z",
    },
    {
      name: "Trailblazer",
      date_utc: "2008-08-03T03:34:00.000Z",
    },
  ];

  render(<Table data={data} columns={columns} name="table" />);

  waitFor(() => {
    expect(screen.queryByTestId("table-error")).toBeInTheDocument();
  });
});

test("throws error if controlled error is passed without reset handler", () => {
  const error = new Error("this is an error thrown from an API?");
  expect(() => render(<Table error={error} name="table" />)).toThrow();
});

test("controlled error is handled by Table", () => {
  const error = new Error("this is an error from API?");
  const resetError = () => {};
  render(
    <Table
      error={error}
      columns={columns}
      data={[]}
      resetErrorHandler={resetError}
      name="test-table"
    />
  );

  waitFor(() => {
    expect(screen.queryByTestId("table-error")).toBeInTheDocument();
  });
  expect(screen.getByText(error.message)).toBeInTheDocument();
});
