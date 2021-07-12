import * as React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { render, RenderOptions } from "@testing-library/react";
import { renderHook, RenderHookOptions } from "@testing-library/react-hooks";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";

const AllProviders = ({ children }: { children?: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <ChakraProvider theme={theme}>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    </ChakraProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

const customRenderHook = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps> | undefined
) => renderHook(callback, { wrapper: AllProviders, ...options });

export { customRender as render };
export { customRenderHook as renderHook };
// callback, options
