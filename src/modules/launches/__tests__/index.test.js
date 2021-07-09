import { renderHook } from "test-utils";
import { useGetLaunches } from "../queries";
import { rest } from "msw";
import { setupServer } from "msw/node";
// import Launches from "modules/launches";

const server = setupServer(
  rest.post(process.env.REACT_APP_BASE_URL + "query", async (req, res, ctx) => {
    return res(
      ctx.json({
        docs: [],
        totalDocs: 0,
        offset: 0,
        limit: 10,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      })
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

test("useGetLaunches returns launch data with no initial filter", async () => {
  const filter = {};
  const { result, waitForNextUpdate } = renderHook(() =>
    useGetLaunches({ filter })
  );
  await waitForNextUpdate();
  expect(result.current.data).toBeTruthy();
});
