export type Option<TValue> = {
  label: string;
  value: TValue;
};

export interface SelectState<TValue> {
  isOpen: boolean;
  selectedOption: Option<TValue> | null;
  highlightedIndex: number;
}

export interface SelectProps<TValue> {
  options: Option<TValue>[];
  value?: TValue;
  onChange?: (option: Option<TValue>) => void;
  readOnly?: Boolean;
  name: string;
}

export enum selectActionTypes {
  setOpen = "setOpen",
  selectOption = "selectOption",
  highlightIndex = "highlightIndex",
}

export type SelectActions<TValue> =
  | {
      type: selectActionTypes.setOpen;
      isOpen: boolean | ((isOpen: boolean) => boolean);
    }
  | {
      type: selectActionTypes.selectOption;
      option: Option<TValue>;
    }
  | {
      type: selectActionTypes.highlightIndex;
      index: number;
    };
