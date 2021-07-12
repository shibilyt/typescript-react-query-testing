import { screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { server } from "test/mocks/server";
import { render, renderHook } from "test/test-utils";
import { useGetLaunches } from "../queries";
import Launches from "modules/launches";
import { launchesEndPoints } from "modules/launches/queries";
import { launchesResolver } from "test/mocks/resolvers";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("useGetLaunches returns launch data with no initial filter", async () => {
  const filter = {};
  const { result, waitForNextUpdate } = renderHook(() =>
    useGetLaunches({ filter })
  );
  await waitForNextUpdate();
  expect(result.current.data).toBeTruthy();
});

test("Launches table displays data from the response", async () => {
  render(<Launches />);
  const table = screen.getByRole("table");
  expect(table).toBeInTheDocument();

  expect(screen.queryByTestId("loading")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
  expect(screen.getAllByRole("row")).toHaveLength(13);
});

test("empty response gives an empty div with table headers", async () => {
  server.use(
    rest.post(
      process.env.REACT_APP_BASE_URL + launchesEndPoints.getLaunches,
      launchesResolver([])
    )
  );

  render(<Launches />);
  const table = screen.getByRole("table");
  expect(table).toBeInTheDocument();
  expect(screen.queryByTestId("loading")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
  expect(screen.queryByTestId("empty-table")).toBeInTheDocument();
  expect(screen.getAllByRole("row")).toHaveLength(1);
});
