import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import Output from "./components/Output";
import Console from "./components/Console";
import Input from "./components/Input";

export default function App() {
  return (
    <Grid
      h="100vh"
      bg="gray.100"
      templateRows="2fr 1fr"
      templateColumns="1fr 1fr"
    >
      <GridItem borderColor="gray.300" borderWidth={1}>
        <Input />
      </GridItem>
      <GridItem borderColor="gray.300" borderWidth={1}>
        <Output />
      </GridItem>
      <GridItem borderColor="gray.300" borderWidth={1} colSpan={2}>
        <Console />
      </GridItem>
    </Grid>
  );
}
