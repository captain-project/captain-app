import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

type GridHeaderProps = BoxProps & {
  label: string;
};

export default function GridHeader({
  label,
  children,
  ...props
}: GridHeaderProps) {
  return (
    <Box
      pos="sticky"
      zIndex={9999}
      top="0"
      px="0.5rem"
      py="0.2rem"
      fontSize="xs"
      fontWeight={700}
      letterSpacing="tight"
      bg="gray.300"
      color="gray.800"
      {...props}
    >
      <div>{label}</div>
      {children}
    </Box>
  );
}
