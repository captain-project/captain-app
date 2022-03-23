import React from "react";
import GridHeader from "./GridHeader";
import { observer } from "mobx-react";
import { Progress } from "@chakra-ui/react";
import { useStore } from "../store";
import Figures from "./Figures";

export default observer(function Output() {
  const store = useStore();
  const result = store.activeResult;

  return (
    <>
      <GridHeader label="Output" />

      {result.simulation.isRunning && (
        <Progress value={result.progress} size="xs" />
      )}

      <Figures figures={store.activeResult.figures} />
    </>
  );
});
