import React from "react";
import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react";
import GridHeader from "./GridHeader";
import { useStore } from "../store";

export default observer(function Console() {
  const store = useStore();
  return (
    <>
      <GridHeader label="Console" />
      <Box overflow="scroll" maxHeight="33vh" w="100%" fontSize="sm">
        <code>
          <pre>{store.activeResult?.consoleOutput}</pre>
        </code>
      </Box>
    </>
  );
});
