import React from "react";
import GridHeader from "./GridHeader";
import { observer } from "mobx-react";
import { useStore } from "../store";

export default observer(function Output() {
  const store = useStore();
  return (
    <>
      <GridHeader label="Output" />
      {store.testImgUrl && <img src={store.testImgUrl} />}
    </>
  );
});
