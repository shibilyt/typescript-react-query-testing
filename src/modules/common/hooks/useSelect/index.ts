import * as React from "react";
import {
  FocusableMode,
  handleRefs,
  isFocusableElement,
  keyCode,
  useWindowEvent,
  useControlledSwitchWarning,
  useOnChangeReadOnlyWarning,
} from "../../utils";

import {
  SelectActions,
  SelectState,
  selectActionTypes,
  SelectProps,
} from "./types";

export type { Option } from "./types";

function selectReducer<TValue>(
  state: SelectState<TValue>,
  action: SelectActions<TValue>
): SelectState<TValue> {
  switch (action.type) {
    case selectActionTypes.setOpen: {
      return {
        ...state,
        isOpen:
          typeof action.isOpen === "function"
            ? action.isOpen(state.isOpen)
            : action.isOpen,
      };
    }
    case selectActionTypes.selectOption: {
      return {
        ...state,
        selectedOption: action.option,
        isOpen: false,
      };
    }
    case selectActionTypes.highlightIndex: {
      return {
        ...state,
        highlightedIndex: action.index,
      };
    }
    default: {
      return state;
    }
  }
}

const initialState = {
  isOpen: false,
  selectedOption: null,
  highlightedIndex: 0,
};

export default function useSelect<TValue>({
  options,
  value: controlledValue,
  onChange,
  readOnly = false,
  name,
}: SelectProps<TValue>) {
  const [{ isOpen, highlightedIndex, selectedOption }, dispatch] =
    React.useReducer<React.Reducer<SelectState<TValue>, SelectActions<TValue>>>(
      selectReducer,
      initialState
    );

  const value = controlledValue ? controlledValue : selectedOption?.value;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useControlledSwitchWarning(controlledValue, "value", "useSelect");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useOnChangeReadOnlyWarning(
      controlledValue,
      "value",
      "Select",
      Boolean(onChange),
      readOnly,
      "readOnly",
      "defaultValue",
      "onChange"
    );
  }

  const setOpen = (isOpen: boolean | ((isOpen: boolean) => boolean)) =>
    dispatch({
      type: selectActionTypes.setOpen,
      isOpen,
    });

  const selectIndex = React.useCallback(
    (index: number) => {
      const option = options[index];
      if (!option.disabled) {
        dispatch({
          type: selectActionTypes.selectOption,
          option,
        });
        onChange?.(option);
      }
    },
    [options, onChange]
  );

  const highlightIndex = React.useCallback((index: number) => {
    dispatch({
      type: selectActionTypes.highlightIndex,
      index,
    });
  }, []);

  const getLabelProps = ({ ...rest } = {}) => {
    return {
      id: name,
      ...rest,
    };
  };

  const buttonRef = React.useRef<HTMLElement | null>(null);
  const getButtonProps = React.useCallback(
    ({ refKey = "ref", ref, onClick, ...rest } = {}) => {
      const getNextIndex = (index: number) => {
        if (index === options.length - 1) {
          return index;
        } else {
          return index + 1;
        }
      };

      const getPrevIndex = (index: number) => {
        if (index === 0) {
          return index;
        } else {
          return index - 1;
        }
      };

      return {
        [refKey]: handleRefs(ref, (button: any) => {
          buttonRef.current = button;
        }),
        tabIndex: 0,
        "aria-labelledby": name,
        "aria-haspopup": "listbox",
        "aria-expanded": isOpen,
        onClick: (e: React.MouseEvent) => {
          setOpen((open) => !open);
          onClick?.(e);
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key !== keyCode.TAB) {
            e.preventDefault();
            e.stopPropagation();
          }

          switch (e.key) {
            case keyCode.DOWN: {
              if (!isOpen) {
                dispatch({
                  type: selectActionTypes.setOpen,
                  isOpen: true,
                });
                break;
              }
              dispatch({
                type: selectActionTypes.highlightIndex,
                index: getNextIndex(highlightedIndex),
              });
              break;
            }
            case keyCode.UP: {
              dispatch({
                type: selectActionTypes.highlightIndex,
                index: getPrevIndex(highlightedIndex),
              });
              break;
            }
            case keyCode.ESC: {
              if (isOpen) {
                dispatch({
                  type: selectActionTypes.setOpen,
                  isOpen: false,
                });
              }
              break;
            }
            case keyCode.SPACE:
            case keyCode.ENTER: {
              if (isOpen) {
                selectIndex(highlightedIndex);
                const option = options[highlightedIndex];
                if (!option.disabled) {
                  dispatch({
                    type: selectActionTypes.setOpen,
                    isOpen: false,
                  });
                }
              } else {
                dispatch({
                  type: selectActionTypes.setOpen,
                  isOpen: true,
                });
              }
              break;
            }
            case keyCode.TAB: {
              if (isOpen) {
                dispatch({
                  type: selectActionTypes.setOpen,
                  isOpen: false,
                });
              }
              break;
            }
            default: {
              break;
            }
          }
          return false;
        },
        ...rest,
      };
    },
    [highlightedIndex, isOpen, name, options, selectIndex]
  );

  const optionRefs = React.useRef<any>({});

  const getOptionProps = React.useCallback(
    ({
      option,
      index,
      onClick,
      onMouseOver,
      refKey = "ref",
      ref,
      ...rest
    }: any = {}) => {
      return {
        key: `${index}-${option.value}`,
        [refKey]: handleRefs(ref, (itemNode: any) => {
          if (itemNode && typeof index === "number") {
            optionRefs.current[index] = itemNode;
          }
        }),
        onClick: (e: any) => {
          selectIndex(index);
          onClick?.(e);
          buttonRef.current?.focus();
        },
        onMouseOver: (e: any) => {
          highlightIndex(index);
          onMouseOver?.(e);
        },
        id: `list-item-${index}-${option.value}`,
        role: "option",
        "aria-selected": selectedOption?.value === option.value,
        ...rest,
      };
    },
    [highlightIndex, selectIndex, selectedOption?.value]
  );

  const listRef = React.useRef<HTMLElement | null>(null);

  const getListProps = React.useCallback(
    ({ refKey = "ref", ref, ...rest } = {}) => {
      const currentOption = options[highlightedIndex];
      return {
        [refKey]: handleRefs(ref, (listNode: any) => {
          listRef.current = listNode;
        }),
        role: "listbox",
        "aria-activedescendant": `list-item-${highlightedIndex}-${currentOption?.value}`,
        ...rest,
      };
    },
    [highlightedIndex, options]
  );

  React.useEffect(() => {
    if (!isOpen) {
      highlightIndex(0);
    }
  }, [highlightIndex, isOpen]);

  useWindowEvent("mousedown", (event) => {
    let target = event.target as HTMLElement;

    if (!isOpen) return;

    if (buttonRef.current?.contains(target)) return;
    if (listRef.current?.contains(target)) return;

    dispatch({ type: selectActionTypes.setOpen, isOpen: false });

    if (!isFocusableElement(target, FocusableMode.Loose)) {
      event.preventDefault();
      buttonRef.current?.focus();
    }
  });

  return {
    isOpen,
    selectedOption,
    value,
    highlightedIndex,
    setOpen,
    selectIndex,
    highlightIndex,
    getButtonProps,
    getLabelProps,
    getOptionProps,
    getListProps,
  };
}
