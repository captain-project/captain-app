import React from "react";
import { Icon, Box, useDisclosure } from "@chakra-ui/react";
import { observer } from "mobx-react";
import GridHeader from "./GridHeader";
import { useStore } from "../store";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default observer(function Console() {
  const store = useStore();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  const iconStyles = {
    transform: !isOpen ? "rotate(-180deg)" : undefined,
    transition: "transform 0.2s",
    transformOrigin: "center",
  };

  return (
    <>
      <GridHeader
        label="Console"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={onToggle}
      >
        <Icon viewBox="0 0 24 24" aria-hidden __css={iconStyles}>
          <path
            fill="currentColor"
            d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
          />
        </Icon>
      </GridHeader>
      <MotionBox
        overflow="scroll"
        initial={false}
        animate={{ height: isOpen ? "33vh" : 0 }}
        transition={{ duration: 0.2, bounce: 0 }}
        w="100%"
        fontSize="sm"
      >
        <code>
          <pre>{store.activeResult?.consoleOutput}</pre>
        </code>
      </MotionBox>
    </>
  );
});
