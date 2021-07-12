import * as React from "react";
import { chakra, HTMLChakraProps } from "@chakra-ui/react";
import { motion } from "framer-motion";

export const Loader = (props: HTMLChakraProps<"svg">) => {
  return (
    <motion.div
      animate={{
        rotate: [0, 360],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <chakra.svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M106 60C106 53.3726 103.314 48 100 48C96.6863 48 94 53.3726 94 60C94 66.6274 96.6863 72 100 72C103.314 72 106 66.6274 106 60Z"
          fill="#E4E4E7"
        />
        <path
          d="M125.196 68.359C128.51 62.6195 128.87 56.6235 126 54.9667C123.13 53.3098 118.118 56.6195 114.804 62.359C111.49 68.0985 111.13 74.0944 114 75.7513C116.87 77.4081 121.883 74.0985 125.196 68.359Z"
          fill="#E4E4E7"
        />
        <path
          d="M137.641 85.1962C143.38 81.8824 146.69 76.8698 145.033 74C143.376 71.1302 137.38 71.4901 131.641 74.8038C125.901 78.1176 122.592 83.1302 124.249 86C125.905 88.8698 131.901 88.5099 137.641 85.1962Z"
          fill="#E4E4E7"
        />
        <path
          d="M140 106C146.627 106 152 103.314 152 100C152 96.6863 146.627 94 140 94C133.373 94 128 96.6863 128 100C128 103.314 133.373 106 140 106Z"
          fill="#E4E4E7"
        />
        <path
          d="M131.641 125.196C137.38 128.51 143.376 128.87 145.033 126C146.69 123.13 143.38 118.118 137.641 114.804C131.901 111.49 125.905 111.13 124.249 114C122.592 116.87 125.901 121.882 131.641 125.196Z"
          fill="#E4E4E7"
        />
        <path
          d="M114.804 137.641C118.117 143.381 123.13 146.69 126 145.033C128.87 143.376 128.51 137.381 125.196 131.641C121.882 125.902 116.87 122.592 114 124.249C111.13 125.906 111.49 131.902 114.804 137.641Z"
          fill="#E4E4E7"
        />
        <path
          d="M94 140C94 146.627 96.6863 152 100 152C103.314 152 106 146.627 106 140C106 133.373 103.314 128 100 128C96.6863 128 94 133.373 94 140Z"
          fill="#E4E4E7"
        />
        <path
          d="M74.8037 131.641C71.49 137.381 71.1301 143.376 73.9999 145.033C76.8696 146.69 81.8823 143.381 85.196 137.641C88.5098 131.902 88.8696 125.906 85.9999 124.249C83.1301 122.592 78.1174 125.902 74.8037 131.641Z"
          fill="#E4E4E7"
        />
        <path
          d="M62.3591 114.804C56.6196 118.118 53.3099 123.13 54.9668 126C56.6237 128.87 62.6196 128.51 68.3591 125.196C74.0986 121.882 77.4083 116.87 75.7514 114C74.0946 111.13 68.0986 111.49 62.3591 114.804Z"
          fill="#E4E4E7"
        />
        <path
          d="M60 94C53.3726 94 48 96.6863 48 100C48 103.314 53.3726 106 60 106C66.6274 106 72 103.314 72 100C72 96.6863 66.6274 94 60 94Z"
          fill="#E4E4E7"
        />
        <path
          d="M68.3591 74.8038C62.6196 71.4901 56.6237 71.1302 54.9668 74C53.3099 76.8698 56.6196 81.8824 62.3591 85.1962C68.0986 88.5099 74.0946 88.8698 75.7514 86C77.4083 83.1302 74.0986 78.1176 68.3591 74.8038Z"
          fill="#E4E4E7"
        />
        <path
          d="M85.1963 62.359C81.8826 56.6195 76.8699 53.3098 74.0001 54.9667C71.1304 56.6235 71.4902 62.6195 74.804 68.359C78.1177 74.0985 83.1304 77.4081 86.0001 75.7513C88.8699 74.0944 88.51 68.0985 85.1963 62.359Z"
          fill="#E4E4E7"
        />
      </chakra.svg>
    </motion.div>
  );
};
