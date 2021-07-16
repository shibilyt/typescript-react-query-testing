import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
  colors: {
    nitroGray: {
      100: "#F4F5F7",
      200: "#E4E4E7",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
    },
  },
  styles: {
    global: {
      body: {
        color: "nitroGray.800",
        fontSize: "16px",
        lineheight: 1,
      },
    },
  },
});
