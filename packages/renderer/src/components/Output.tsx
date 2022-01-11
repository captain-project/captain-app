import React from "react";
import GridHeader from "./GridHeader";
import { observer } from "mobx-react";
import { Skeleton } from "@chakra-ui/react";
import { useStore } from "../store";

const Figure = ({ url }: { url?: string } = {}) => {
  return (
    <Skeleton width={100} height={100} isLoaded={!!url}>
      <img src={url} />
    </Skeleton>
  );
};

const PlaceholderOutput = observer(function () {
  const store = useStore();
  const { numSteps, numSpecies } = store.simulation;
  return (
    <div>
      <Figure />
      Num steps: {numSteps}, num species: {numSpecies}
    </div>
  );
});

const ActiveResult = observer(function () {
  const store = useStore();
  const { activeResult } = store.results;
  return (
    <div>
      <Figure />
      Active result!
    </div>
  );
});

export default observer(function Output() {
  const store = useStore();

  return (
    <>
      <GridHeader label="Output" />
      {store.results.activeResult ? <ActiveResult /> : <PlaceholderOutput />}
    </>
  );
});
