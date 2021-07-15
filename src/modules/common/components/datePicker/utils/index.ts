import { Option } from "modules/common/hooks/useSelect";

type ReturnMethodParams = {
  selectedFirstOrLastColor: string;
  normalColor: string;
  selectedColor: string;
  rangeHoverColor: string;
  disabledColor: string;
};

export function getColor(
  isSelected: boolean,
  isSelectedStartOrEnd: boolean,
  isWithinHoverRange: boolean,
  isDisabled: boolean
) {
  return ({
    selectedFirstOrLastColor,
    normalColor,
    selectedColor,
    rangeHoverColor,
    disabledColor,
  }: ReturnMethodParams) => {
    if (isSelectedStartOrEnd) {
      return selectedFirstOrLastColor;
    } else if (isSelected) {
      return selectedColor;
    } else if (isWithinHoverRange) {
      return rangeHoverColor;
    } else if (isDisabled) {
      return disabledColor;
    } else {
      return normalColor;
    }
  };
}

function getYearOptions(options?: {
  disableFrom?: number | boolean;
  disableTo?: number | boolean;
}) {
  let start = 2005;
  let end = 2030;
  let years: Option<number>[] = [];

  for (let i = start; i <= end; i++) {
    let disabled = false;
    if (options?.disableFrom && options.disableFrom <= i) {
      disabled = true;
    }
    if (options?.disableTo && options.disableTo >= i) {
      disabled = true;
    }
    years.push({ label: `${i}`, value: i, ...(disabled ? { disabled } : {}) });
  }
  return years;
}

export function getOptions(
  type: "month" | "year",
  options?: {
    disableFrom?: number | boolean;
    disableTo?: number | boolean;
  }
): Option<number>[] {
  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return type === "month"
    ? monthOptions.map((month, index): Option<number> => {
        let disabled = false;
        if (options?.disableFrom && options?.disableFrom <= index) {
          disabled = true;
        }
        if (options?.disableTo && options.disableTo >= index) {
          disabled = true;
        }
        return {
          label: month,
          value: index,
          ...(disabled ? { disabled } : {}),
        };
      })
    : getYearOptions(options);
}
