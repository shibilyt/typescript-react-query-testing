import * as React from "react";
import {
  chakra,
  UnorderedList,
  ListItem,
  VisuallyHidden,
  Text,
  VStack,
  Box,
} from "@chakra-ui/react";
import { usePopper } from "react-popper";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

import useSelect, { Option } from "modules/common/hooks/useSelect";
import { getOptions } from "../../utils";

interface MonthYearSelectProps<TValue> {
  name: string;
  type: "month" | "year";
  value: TValue;
  onChange: (option: Option<TValue>) => void;
  getPrev: () => void;
  getNext: () => void;
  disableFrom?: number | boolean;
  disableTo?: number | boolean;
}

export default function MonthYearSelect({
  name,
  type = "month",
  value,
  onChange,
  getPrev,
  getNext,
  disableFrom,
  disableTo,
}: MonthYearSelectProps<number>) {
  let options = getOptions(type, { disableFrom, disableTo });

  const {
    isOpen,
    highlightedIndex,
    getButtonProps,
    getLabelProps,
    getListProps,
    getOptionProps,
  } = useSelect<number>({
    options,
    name,
    value,
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

  const selectedValueLabel = React.useMemo(() => {
    const option = options.find((option) => option.value === value);
    return option?.label;
  }, [options, value]);

  return (
    <Box pos="relative">
      <VisuallyHidden>
        <chakra.label {...getLabelProps()}>
          {type === "month" ? "select a month" : "select an year"}
        </chakra.label>
      </VisuallyHidden>
      <chakra.button
        {...getButtonProps({
          ref: setReferenceElement,
          "aria-labelledby": `${name}-selected`,
        })}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        p={0}
        w={type === "month" ? "104px" : "80px"}
      >
        <Text
          mr={1}
          as="span"
          id={`${name}-selected`}
          textAlign="right"
          fontWeight="600"
        >
          {selectedValueLabel}
        </Text>
        <VStack spacing={0} as="span">
          <TriangleUpIcon
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (typeof disableTo === "number" && value - 1 <= disableTo) {
                return;
              }
              getPrev();
            }}
            data-testid="select-prev"
            width={3}
            height="10px"
            lineHeight={"10px"}
            color="gray.500"
          />
          <TriangleDownIcon
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (typeof disableFrom === "number" && value + 1 >= disableFrom) {
                return;
              }
              getNext();
            }}
            data-testid="select-next"
            width={3}
            height="10px"
            lineHeight={"10px"}
            m={0}
            color="gray.500"
          />
        </VStack>
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
                color: option.disabled ? "gray.400" : "nitroGray.800",
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
    </Box>
  );
}
