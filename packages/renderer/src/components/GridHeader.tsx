import React from "react";
import { Box } from "@chakra-ui/react";

export default function GridHeader({ label }: { label: string }) {
  return (
    <Box
      px="0.3rem"
      py="0.2rem"
      fontSize="xs"
      fontWeight={700}
      letterSpacing="tight"
      bg="gray.300"
      color="gray.800"
    >
      {label}
    </Box>
  );
}
