import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "test/test-utils";
import Select from "../";

const options = [
  {
    label: "option 1",
    value: "opt1",
  },
  {
    label: "option 2",
    value: "opt2",
  },
  {
    label: "option 3",
    value: "opt3",
  },
  {
    label: "option 4",
    value: "opt4",
  },
];

describe("select", () => {
  test("is rendered and opens and closes the list", () => {
    const placeholder = "select an option";
    render(<Select options={options} placeholder={placeholder} />);

    const selectButton = screen.getByRole("button");
    expect(selectButton).toHaveTextContent(placeholder);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    userEvent.click(selectButton);
    expect(screen.queryByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(4);

    userEvent.click(selectButton);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  test("clicking an option sets the selected value to selected option value and closes the list", () => {
    render(<Select options={options} />);

    const selectButton = screen.getByRole("button");

    userEvent.click(selectButton);

    userEvent.click(screen.getByText(options[1].label));

    expect(selectButton).toHaveTextContent(options[1].label);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    userEvent.click(selectButton);

    userEvent.click(screen.getByText(options[0].label));

    expect(selectButton).toHaveTextContent(options[0].label);
  });

  test("clicking outside the select closes the list if it is open", () => {
    render(
      <div>
        <div>another div</div>
        <Select options={options} />
      </div>
    );

    const selectButton = screen.getByRole("button");

    userEvent.click(selectButton);
    expect(screen.queryByRole("listbox")).toBeInTheDocument();

    userEvent.click(screen.getByText("another div"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
