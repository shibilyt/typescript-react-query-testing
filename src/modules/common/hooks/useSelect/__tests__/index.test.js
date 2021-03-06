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

describe("useSelect", () => {
  test("returns proper value when selecting an option", () => {
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
    const { result } = renderHook(() =>
      useSelect({ options, value, onChange })
    );

    expect(result.current.value).toEqual(value);

    act(() => {
      result.current.selectIndex(1);
    });
    const option = options[1];

    expect(result.current.selectedOption).toEqual(option);

    expect(onChange).toHaveBeenCalledWith(option);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("should not allow disable options to be selected", () => {
    let optionsWithDisabled = [
      ...options,
      { label: "disabled option", value: "disabled", disabled: true },
    ];
    let value = "opt2";
    const onChange = jest.fn((option) => {
      value = option.value;
    });
    const { result } = renderHook(() =>
      useSelect({ options: optionsWithDisabled, value, onChange })
    );

    expect(result.current.value).toEqual(value);
    act(() => {
      result.current.setOpen(true);
    });

    act(() => {
      result.current.selectIndex(optionsWithDisabled.length - 1);
    });

    //   should not close when clicking on disabled option
    expect(result.current.isOpen).toEqual(true);

    //   shouldn't change value on click disabled option
    expect(result.current.value).toEqual(value);
  });
});
