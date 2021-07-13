import { act } from "@testing-library/react";
import useSelect from "../";
import { renderHook } from "test/test-utils";

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
test("useSelect returns proper value when selecting an option", () => {
  const { result } = renderHook(() => useSelect({ options }));

  expect(result.current.value).toBeUndefined();
  act(() => {
    result.current.selectIndex(1);
  });
  expect(result.current.value).toEqual("opt2");
});

test("controlled Value sets value properly", () => {
  let value = "test Value";
  const { result, rerender } = renderHook(() =>
    useSelect({ options, value, onChange: () => {} })
  );

  expect(result.current.value).toEqual(value);

  value = "updated value";
  rerender();
  expect(result.current.value).toEqual(value);
});

test("controlled select receives selectedOption in onChange", () => {
  let value = "test Value";
  const onChange = jest.fn((option) => {
    value = option.value;
  });
  const { result } = renderHook(() => useSelect({ options, value, onChange }));

  expect(result.current.value).toEqual(value);

  act(() => {
    result.current.selectIndex(1);
  });
  const option = options[1];

  expect(result.current.selectedOption).toEqual(option);

  expect(onChange).toHaveBeenCalledWith(option);
  expect(onChange).toHaveBeenCalledTimes(1);
});
