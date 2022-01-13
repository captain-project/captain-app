import React from "react";
import GridHeader from "./GridHeader";
import { observer } from "mobx-react";
import { Skeleton, Icon } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useStore } from "../store";
import type ResultStore from "../store/ResultStore";
import { AiOutlineClose } from "react-icons/ai";

const Figure = ({ url }: { url?: string } = {}) => {
  return (
    <Skeleton width={200} height={200} isLoaded={!!url}>
      <img src={url} />
    </Skeleton>
  );
};

const Result = observer(({ result }: { result: ResultStore }) => {
  return (
    <div>
      {result.name}
      <Figure />
      Current step: {result.currentStep}
    </div>
  );
});

export default observer(function Output() {
  const store = useStore();

  return (
    <>
      <GridHeader label="Output" />
      <Tabs
        variant="enclosed"
        onChange={store.setTabIndex}
        index={store.tabIndex}
      >
        <TabList>
          {store.results.map((result, i) => (
            <Tab selected={store.tabIndex === i} key={i} pr={2}>
              {result.name}
              <Icon
                ml={2}
                mr={0}
                color="transparent"
                transition="all 0.3s"
                _hover={{
                  color: "gray.600",
                }}
                as={AiOutlineClose}
                onClick={() => store.remove(i)}
              />
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {store.results.map((result, i) => (
            <TabPanel key={i}>
              <Result result={result} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
});
