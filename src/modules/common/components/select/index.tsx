import * as React from "react";
import {
  chakra,
  UnorderedList,
  ListItem,
  VisuallyHidden,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import useSelect, { Option } from "modules/common/hooks/useSelect";
import { usePopper } from "react-popper";

interface SelectProps<TValue> {
  name: string;
  label?: string;
  placeholder?: string;
  startIcon?: React.ReactElement;
  options: Option<TValue>[];
  value?: TValue;
  onChange?: (option: Option<TValue>) => void;
}

export default function Select<TValue = string>({
  name,
  label = "select an option",
  placeholder = "select an option",
  startIcon: StartIcon,
  options,
  value: controlledValue,
  onChange,
}: SelectProps<TValue>) {
  const {
    isOpen,
    selectedOption,
    highlightedIndex,
    getButtonProps,
    getLabelProps,
    getListProps,
    getOptionProps,
  } = useSelect<TValue>({
    options,
    name,
    value: controlledValue,
    onChange,
  });

  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  return (
    <chakra.div pos="relative">
      <VisuallyHidden>
        <chakra.label {...getLabelProps()}>{label}</chakra.label>
      </VisuallyHidden>
      <chakra.button
        {...getButtonProps({ ref: setReferenceElement })}
        display="flex"
        alignItems="center"
        p={0}
      >
        {StartIcon ? StartIcon : null}
        <Text ml={StartIcon ? 2 : 0} mr={2} as="span">
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDownIcon />
      </chakra.button>
      {isOpen ? (
        <UnorderedList
          {...getListProps({ ref: setPopperElement, ...attributes.popper })}
          sx={{
            ...styles.popper,
            boxShadow: "0px 1px 3px 0px #0000001A",
          }}
          width="max-content"
          bg="white"
          rounded="md"
          py={1}
          listStyleType="none"
          mx={0}
        >
          {options.map((option, index) => (
            <ListItem
              {...getOptionProps({
                index,
                option,
                bg: highlightedIndex === index ? "nitroGray.200" : "white",
                px: 4,
                py: 2,
              })}
              _hover={{
                cursor: "default",
              }}
            >
              {option.label}
            </ListItem>
          ))}
        </UnorderedList>
      ) : null}
    </chakra.div>
  );
}
