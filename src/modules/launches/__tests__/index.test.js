import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

test("useGetLaunches returns launch data with filters", async () => {
  let filter = "all";
  const { result, waitForNextUpdate, rerender } = renderHook(() =>
    useGetLaunches({ filter })
  );
  await waitForNextUpdate();
  expect(result.current.data.docs).toHaveLength(12);
  filter = "upcoming";
  rerender();
  await waitFor(() => {
    expect(result.current.status).toEqual("success");
  });
  expect(result.current.data.docs).toHaveLength(9);
  filter = "success";
  rerender();
  await waitFor(() => {
    expect(result.current.status).toEqual("success");
  });
  expect(result.current.data.docs).toHaveLength(0);
  filter = "failed";
  rerender();
  await waitFor(() => {
    expect(result.current.status).toEqual("success");
  });
  expect(result.current.data.docs).toHaveLength(3);
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

test("upcoming filter filters out upcoming launches", async () => {
  render(<Launches />);
  const selectButton = screen.getByRole("button", { name: /all launches/i });
  expect(screen.queryByTestId("loading")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
  userEvent.click(selectButton);
  userEvent.click(screen.getByRole("option", { name: /upcoming/i }));
  expect(screen.queryByTestId("loading")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
  expect(screen.getAllByRole("row")).toHaveLength(10);
});

test("success filter filters out successful launches", async () => {
  render(<Launches />);
  const selectButton = screen.getByRole("button", { name: /all launches/i });
  expect(screen.queryByTestId("loading")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
  userEvent.click(selectButton);
  userEvent.click(screen.getByRole("option", { name: /success/i }));
  expect(screen.queryByTestId("loading")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
  expect(screen.getAllByRole("row")).toHaveLength(1);
});

test("fail filter filters out failed launches", async () => {
  render(<Launches />);
  const selectButton = screen.getByRole("button", { name: /all launches/i });
  expect(screen.queryByTestId("loading")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
  userEvent.click(selectButton);
  userEvent.click(screen.getByRole("option", { name: /failed/i }));
  expect(screen.queryByTestId("loading")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
  expect(screen.getAllByRole("row")).toHaveLength(4);
});
