import * as React from "react";
import { Flex, Container } from "@chakra-ui/react";

import { Logo } from "assets/Logo";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Flex direction="column" bg="white" height="100vh">
      <Flex align="center" justify="center" bg="white" py="5" boxShadow="xs">
        <Logo flexShrink={0} maxHeight="8" />
      </Flex>
      <Container maxW='container.lg'>{children}</Container>
    </Flex>
  );
}
