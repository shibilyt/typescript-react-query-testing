import * as React from "react";
import warning from "warning";

export type OptionType = {
  label: string;
  value: string;
};

export enum keyCode {
  TAB = "Tab",
  ENTER = "Enter",
  SPACE = " ",
  ESC = "Escape",
  UP = "ArrowUp",
  DOWN = "ArrowDown",
  PageUp = "PageUp",
  PageDown = "PageDown",
  Home = "Home",
  End = "End",
}
export function handleRefs(...refs: any) {
  return (node: any) => {
    refs.forEach((ref: any) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    });
  };
}

export enum FocusableMode {
  /** The element itself must be focusable. */
  Strict,

  /** The element should be inside of a focusable element. */
  Loose,
}

let focusableSelector = [
  "[contentEditable=true]",
  "[tabindex]",
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "iframe",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
]
  .map(
    process.env.NODE_ENV === "test"
      ? // TODO: Remove this once JSDOM fixes the issue where an element that is
        // "hidden" can be the document.activeElement, because this is not possible
        // in real browsers.
        (selector) =>
          `${selector}:not([tabindex='-1']):not([style*='display: none'])`
      : (selector) => `${selector}:not([tabindex='-1'])`
  )
  .join(",");

export function isFocusableElement(
  element: HTMLElement,
  mode: FocusableMode = FocusableMode.Strict
) {
  if (element === document.body) return false;

  return match(mode, {
    [FocusableMode.Strict]() {
      return element.matches(focusableSelector);
    },
    [FocusableMode.Loose]() {
      let next: HTMLElement | null = element;

      while (next !== null) {
        if (next.matches(focusableSelector)) return true;
        next = next.parentElement;
      }

      return false;
    },
  });
}

export function match<
  TValue extends string | number = string,
  TReturnValue = unknown
>(
  value: TValue,
  lookup: Record<TValue, TReturnValue | ((...args: any[]) => TReturnValue)>,
  ...args: any[]
): TReturnValue {
  if (value in lookup) {
    let returnValue = lookup[value];
    return typeof returnValue === "function"
      ? returnValue(...args)
      : returnValue;
  }

  let error = new Error(
    `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      lookup
    )
      .map((key) => `"${key}"`)
      .join(", ")}.`
  );
  if (Error.captureStackTrace) Error.captureStackTrace(error, match);
  throw error;
}

export function useWindowEvent<TType extends keyof WindowEventMap>(
  type: TType,
  listener: (this: Window, ev: WindowEventMap[TType]) => any,
  options?: boolean | AddEventListenerOptions
) {
  let listenerRef = React.useRef(listener);
  listenerRef.current = listener;

  React.useEffect(() => {
    function handler(event: WindowEventMap[TType]) {
      listenerRef.current.call(window, event);
    }

    window.addEventListener(type, handler, options);
    return () => window.removeEventListener(type, handler, options);
  }, [type, options]);
}

export function useControlledSwitchWarning(
  controlPropValue: any,
  controlPropName: string,
  componentName: string
) {
  const isControlled = controlPropValue != null;
  const { current: wasControlled } = React.useRef(isControlled);

  React.useEffect(() => {
    warning(
      !(isControlled && !wasControlled),
      `\`${componentName}\` is changing from uncontrolled to be controlled. Components should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled \`${componentName}\` for the lifetime of the component. Check the \`${controlPropName}\` prop.`
    );
    warning(
      !(!isControlled && wasControlled),
      `\`${componentName}\` is changing from controlled to be uncontrolled. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled \`${componentName}\` for the lifetime of the component. Check the \`${controlPropName}\` prop.`
    );
  }, [componentName, controlPropName, isControlled, wasControlled]);
}

export function useOnChangeReadOnlyWarning(
  controlPropValue: any,
  controlPropName: string,
  componentName: string,
  hasOnChange: Boolean,
  readOnly: Boolean,
  readOnlyProp: string,
  initialValueProp: string,
  onChangeProp: string
) {
  const isControlled = controlPropValue != null;
  React.useEffect(() => {
    warning(
      !(!hasOnChange && isControlled && !readOnly),
      `A \`${controlPropName}\` prop was provided to \`${componentName}\` without an \`${onChangeProp}\` handler. This will result in a read-only \`${controlPropName}\` value. If you want it to be mutable, use \`${initialValueProp}\`. Otherwise, set either \`${onChangeProp}\` or \`${readOnlyProp}\`.`
    );
  }, [
    componentName,
    controlPropName,
    isControlled,
    hasOnChange,
    readOnly,
    onChangeProp,
    initialValueProp,
    readOnlyProp,
  ]);
}
