import React from "react";
import { Box, Button, FormControl } from "@chakra-ui/react";
import { observer } from "mobx-react";
import app from "../store/client";

export default observer(function Test() {
  const onClickTest = async () => {
    const message = {
      // type: "test:optimizePlotData",
      type: "test:python",
    };
    console.log("Testing:", message);
    await app.service("messages").create(message);
  };

  return (
    <>
      <Box p={2}>
        <div>Test</div>
        <FormControl>
          <Button onClick={onClickTest}>Test result</Button>
        </FormControl>
      </Box>
    </>
  );
});
