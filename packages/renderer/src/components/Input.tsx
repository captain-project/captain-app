import React from "react";
import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useStore } from "../store";
import GridHeader from "./GridHeader";

export default observer(function Input() {
  const store = useStore();

  const onButtonClick = () => {
    store.test();
  };

  return (
    <>
      <GridHeader label="Input" />
      <Button onClick={onButtonClick}>Test</Button>
    </>
  );
});
