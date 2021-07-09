import { screen, within } from "@testing-library/react";
import { render } from "test-utils";
import Table from "..";

test("table renders with proper headers and data", () => {
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
      fairings: {
        reused: false,
        recovery_attempt: false,
        recovered: false,
        ships: [],
      },
      links: {
        patch: {
          small: "https://images2.imgbox.com/3c/0e/T8iJcSN3_o.png",
          large: "https://images2.imgbox.com/40/e3/GypSkayF_o.png",
        },
        reddit: {
          campaign: null,
          launch: null,
          media: null,
          recovery: null,
        },
        flickr: {
          small: [],
          original: [],
        },
        presskit: null,
        webcast: "https://www.youtube.com/watch?v=0a_00nJ_Y88",
        youtube_id: "0a_00nJ_Y88",
        article:
          "https://www.space.com/2196-spacex-inaugural-falcon-1-rocket-lost-launch.html",
        wikipedia: "https://en.wikipedia.org/wiki/DemoSat",
      },
      static_fire_date_utc: "2006-03-17T00:00:00.000Z",
      static_fire_date_unix: 1142553600,
      tbd: false,
      net: false,
      window: 0,
      rocket: "5e9d0d95eda69955f709d1eb",
      success: false,
      details: "Engine failure at 33 seconds and loss of vehicle",
      crew: [],
      ships: [],
      capsules: [],
      payloads: ["5eb0e4b5b6c3bb0006eeb1e1"],
      launchpad: "5e9e4502f5090995de566f86",
      auto_update: true,
      launch_library_id: null,
      failures: [
        {
          time: 33,
          altitude: null,
          reason: "merlin engine failure",
        },
      ],
      flight_number: 1,
      name: "FalconSat",
      date_utc: "2006-03-24T22:30:00.000Z",
      date_unix: 1143239400,
      date_local: "2006-03-25T10:30:00+12:00",
      date_precision: "hour",
      upcoming: false,
      cores: [
        {
          core: "5e9e289df35918033d3b2623",
          flight: 1,
          gridfins: false,
          legs: false,
          reused: false,
          landing_attempt: false,
          landing_success: null,
          landing_type: null,
          landpad: null,
        },
      ],
      id: "5eb87cd9ffd86e000604b32a",
    },
    {
      fairings: {
        reused: false,
        recovery_attempt: false,
        recovered: false,
        ships: [],
      },
      links: {
        patch: {
          small: "https://images2.imgbox.com/4f/e3/I0lkuJ2e_o.png",
          large: "https://images2.imgbox.com/be/e7/iNqsqVYM_o.png",
        },
        reddit: {
          campaign: null,
          launch: null,
          media: null,
          recovery: null,
        },
        flickr: {
          small: [],
          original: [],
        },
        presskit: null,
        webcast: "https://www.youtube.com/watch?v=Lk4zQ2wP-Nc",
        youtube_id: "Lk4zQ2wP-Nc",
        article:
          "https://www.space.com/3590-spacex-falcon-1-rocket-fails-reach-orbit.html",
        wikipedia: "https://en.wikipedia.org/wiki/DemoSat",
      },
      static_fire_date_utc: null,
      static_fire_date_unix: null,
      tbd: false,
      net: false,
      window: 0,
      rocket: "5e9d0d95eda69955f709d1eb",
      success: false,
      details:
        "Successful first stage burn and transition to second stage, maximum altitude 289 km, Premature engine shutdown at T+7 min 30 s, Failed to reach orbit, Failed to recover first stage",
      crew: [],
      ships: [],
      capsules: [],
      payloads: ["5eb0e4b6b6c3bb0006eeb1e2"],
      launchpad: "5e9e4502f5090995de566f86",
      auto_update: true,
      launch_library_id: null,
      failures: [
        {
          time: 301,
          altitude: 289,
          reason: "harmonic oscillation leading to premature engine shutdown",
        },
      ],
      flight_number: 2,
      name: "DemoSat",
      date_utc: "2007-03-21T01:10:00.000Z",
      date_unix: 1174439400,
      date_local: "2007-03-21T13:10:00+12:00",
      date_precision: "hour",
      upcoming: false,
      cores: [
        {
          core: "5e9e289ef35918416a3b2624",
          flight: 1,
          gridfins: false,
          legs: false,
          reused: false,
          landing_attempt: false,
          landing_success: null,
          landing_type: null,
          landpad: null,
        },
      ],
      id: "5eb87cdaffd86e000604b32b",
    },
    {
      fairings: {
        reused: false,
        recovery_attempt: false,
        recovered: false,
        ships: [],
      },
      links: {
        patch: {
          small: "https://images2.imgbox.com/3d/86/cnu0pan8_o.png",
          large: "https://images2.imgbox.com/4b/bd/d8UxLh4q_o.png",
        },
        reddit: {
          campaign: null,
          launch: null,
          media: null,
          recovery: null,
        },
        flickr: {
          small: [],
          original: [],
        },
        presskit: null,
        webcast: "https://www.youtube.com/watch?v=v0w9p3U8860",
        youtube_id: "v0w9p3U8860",
        article:
          "http://www.spacex.com/news/2013/02/11/falcon-1-flight-3-mission-summary",
        wikipedia: "https://en.wikipedia.org/wiki/Trailblazer_(satellite)",
      },
      static_fire_date_utc: null,
      static_fire_date_unix: null,
      tbd: false,
      net: false,
      window: 0,
      rocket: "5e9d0d95eda69955f709d1eb",
      success: false,
      details:
        "Residual stage 1 thrust led to collision between stage 1 and stage 2",
      crew: [],
      ships: [],
      capsules: [],
      payloads: ["5eb0e4b6b6c3bb0006eeb1e3", "5eb0e4b6b6c3bb0006eeb1e4"],
      launchpad: "5e9e4502f5090995de566f86",
      auto_update: true,
      launch_library_id: null,
      failures: [
        {
          time: 140,
          altitude: 35,
          reason:
            "residual stage-1 thrust led to collision between stage 1 and stage 2",
        },
      ],
      flight_number: 3,
      name: "Trailblazer",
      date_utc: "2008-08-03T03:34:00.000Z",
      date_unix: 1217734440,
      date_local: "2008-08-03T15:34:00+12:00",
      date_precision: "hour",
      upcoming: false,
      cores: [
        {
          core: "5e9e289ef3591814873b2625",
          flight: 1,
          gridfins: false,
          legs: false,
          reused: false,
          landing_attempt: false,
          landing_success: null,
          landing_type: null,
          landpad: null,
        },
      ],
      id: "5eb87cdbffd86e000604b32c",
    },
  ];

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
    // highlight-start
    const utils = within(row);
    expect(utils.getByText(flight_number)).toBeInTheDocument();
    expect(utils.getByText(name)).toBeInTheDocument();
    expect(utils.getByText(date_utc)).toBeInTheDocument();
    expect(utils.getByText(launchpad)).toBeInTheDocument();
  });
});
