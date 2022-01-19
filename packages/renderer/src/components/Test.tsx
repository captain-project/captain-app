import React from "react";
import { Box, Button, FormControl } from "@chakra-ui/react";
import { observer } from "mobx-react";
import app from "../store/client";

export default observer(function Test() {
  const onClickTest = async () => {
    console.log("Creating test message...");
    const m = await app
      .service("messages")
      .create({ text: `Random number: ${Math.round(Math.random() * 100)}` });
    console.log("Created test message:", m);
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
