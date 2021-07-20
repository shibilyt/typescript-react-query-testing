import * as React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  VStack,
  chakra,
  HStack,
  Image,
  Box,
  Badge,
  Link,
  Heading,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { SpaceXApiResponse } from "modules/launches/types";
import { getStatusOfLaunch } from "modules/launches/utils";

import Wikipedia from "assets/Wikipedia.png";
import Youtube from "assets/Youtube.png";
import { format } from "date-fns";

interface LaunchDetailProps {
  data: SpaceXApiResponse;
  isOpen: boolean;
  handleClose: () => void;
}

export default function LaunchDetail({
  data,
  isOpen,
  handleClose,
}: LaunchDetailProps) {
  console.log("data  ", data);
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size=""
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <ModalContent maxW={"34em"}>
        <ModalBody p={8} position="relative">
          <chakra.button
            aria-label="close launch detail"
            onClick={handleClose}
            position="absolute"
            top={5}
            right={5}
            p={2}
          >
            <CloseIcon h={3} w={3} />
          </chakra.button>
          <LaunchContent data={data} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function LaunchContent({ data }: { data: SpaceXApiResponse }) {
  const status = getStatusOfLaunch(data);
  const statusBadgeEnum: Record<string, string> = {
    Upcoming: "orange",
    Success: "green",
    Failed: "red",
  };
  return (
    <VStack spacing={4} data-testid="launch-details">
      <HStack w="full" spacing={4}>
        <Image
          boxSize="80px"
          objectFit="cover"
          src={data.links?.patch?.small as string}
          alt="launch mission patch"
        />

        <VStack alignItems="flex-start" spacing={2}>
          <HStack>
            <Heading as="h1" fontSize="18px" fontWeight="500" lineHeight={1}>
              {data.name}
            </Heading>

            <Badge
              display="inline"
              fontSize="xs"
              colorScheme={statusBadgeEnum[status]}
              px={3}
              py={1}
              borderRadius="2xl"
              textTransform="capitalize"
              fontWeight="600"
            >
              {status}
            </Badge>
          </HStack>
          <Text fontSize={12} lineHeight={1}>
            {data.rocket?.name}
          </Text>

          <HStack>
            {data.links?.wikipedia ? (
              <Link href={data.links?.wikipedia}>
                <Image
                  boxSize="16px"
                  objectFit="cover"
                  src={Wikipedia}
                  alt="wikipedia"
                />
              </Link>
            ) : null}

            {data.links?.youtube_id ? (
              <Link
                href={`https://www.youtube.com/watch?v=${data.links?.youtube_id}`}
              >
                <Image
                  boxSize="16px"
                  objectFit="cover"
                  src={Youtube}
                  alt="youtube"
                />
              </Link>
            ) : null}
          </HStack>
        </VStack>
      </HStack>

      {data.details ? (
        <Box lineHeight={6} fontSize={"14px"} pb={4}>
          {data.details}
          {data.links?.wikipedia ? (
            <Link
              href={data.links?.wikipedia}
              color="blue.600"
              fontWeight="500"
            >
              {" "}
              Wikipedia
            </Link>
          ) : null}
        </Box>
      ) : null}

      <DataRow title="Flight Number" data={data.flight_number} />
      <DataRow title="Rocket Type" data={data.rocket?.type} />
      <DataRow title="Rocket Name" data={data.rocket?.name} />
      <DataRow title="Manufacturer" data={data.rocket?.company} />
      <DataRow title="Nationality" data={data.rocket?.country} />
      <DataRow
        title="Launch Date"
        data={format(new Date(data.date_utc), "dd MMMM yyyy HH:mm")}
      />
      <DataRow
        title="Payload Type"
        data={data.payloads?.map((payload) => payload.type).join(", ")}
      />
      <DataRow
        title="Orbit"
        data={data.payloads?.map((payload) => payload.orbit).join(", ")}
      />
      <DataRow title="Launch Site" data={data.launchpad?.name} noBorder />
    </VStack>
  );
}

const DataRow = ({ title, data, noBorder }: any) =>
  data ? (
    <HStack
      borderBottom={noBorder ? 0 : "1px"}
      borderColor="gray.300"
      pb={4}
      w="full"
      lineHeight={1}
      fontSize="14px"
    >
      <Text w="33%">{title}</Text>
      <Text w="66%">{data}</Text>
    </HStack>
  ) : null;
