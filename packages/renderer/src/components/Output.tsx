import React from "react";
import GridHeader from "./GridHeader";
import { observer } from "mobx-react";
import { Icon, Progress } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useStore } from "../store";
import type ResultStore from "../store/ResultStore";
import { AiOutlineClose } from "react-icons/ai";
import Figures from "./Figures";

const ResultProgress = observer(({ result }: { result: ResultStore }) => {
  return <Progress value={result.progress} size="xs" />;
});

const Result = observer(({ result }: { result: ResultStore }) => {
  return (
    <div>
      <ResultProgress result={result} />
      <Figures figures={result.figures} />
    </div>
  );
});

export default observer(function Output() {
  const store = useStore();

  return (
    <>
      <GridHeader label="Output" />
      <Result result={store.activeResult} />
    </>
  );
});
