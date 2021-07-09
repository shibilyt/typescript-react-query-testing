import * as React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { renderHook, RenderHookOptions } from "@testing-library/react-hooks";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ChakraProvider>
);

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

const customRenderHook = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps> | undefined
) => renderHook(callback, { wrapper: AllProviders, ...options });

export { customRender as render };
export { customRenderHook as renderHook };
// callback, options
