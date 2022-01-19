import React from "react";
import {
  Box,
  Grid,
  Button,
  HStack,
  Select,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useStore } from "../store";
import GridHeader from "./GridHeader";
import Test from "./Test";

export default observer(function Input() {
  const store = useStore();

  return (
    <>
      <GridHeader label="Input" />
      <Box p={2}>
        <FormControl>
          <Grid templateColumns="3fr 1fr" gap={2}>
            <FormLabel htmlFor="num-species" w="100%">
              Number of species
            </FormLabel>
            <NumberInput
              size="sm"
              max={50}
              min={5}
              value={store.activeResult.simulation.numSpecies}
              onChange={(_, value) =>
                store.activeResult.simulation.setNumSpecies(value)
              }
            >
              <NumberInputField id="num-species" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <FormLabel htmlFor="grid-size">Grid size</FormLabel>
            <NumberInput
              size="sm"
              max={100}
              min={10}
              value={store.activeResult.simulation.gridSize}
              onChange={(_, value) =>
                store.activeResult.simulation.setGridSize(value)
              }
            >
              <NumberInputField id="grid-size" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormLabel htmlFor="cell-capacity">Cell capacity</FormLabel>
            <NumberInput
              size="sm"
              max={60}
              min={5}
              value={store.activeResult.simulation.cellCapacity}
              onChange={(_, value) =>
                store.activeResult.simulation.setCellCapacity(value)
              }
            >
              <NumberInputField id="cell-capacity" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormLabel htmlFor="num-steps">Num steps</FormLabel>
            <NumberInput
              size="sm"
              max={20}
              min={1}
              value={store.activeResult.simulation.numSteps}
              onChange={(_, value) =>
                store.activeResult.simulation.setNumSteps(value)
              }
            >
              <NumberInputField id="num-steps" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormLabel htmlFor="dispersal-rate">Dispersal rate</FormLabel>
            <NumberInput
              size="sm"
              max={1}
              step={0.1}
              min={0}
              value={store.activeResult.simulation.dispersalRate}
              onChange={(_, value) =>
                store.activeResult.simulation.setDispersalRate(value)
              }
            >
              <NumberInputField id="dispersal-rate" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Grid>

          <Select value="No policy" onChange={(value) => {}}>
            <option value="No policy">No policy</option>
            <option value="Random">Random</option>
          </Select>

          <Button
            isLoading={store.activeResult.simulation.running}
            onClick={() => store.activeResult.simulation.run()}
          >
            Run simulation
          </Button>

          <Test />

          {/* <Button onClick={() => store.create()}>Test result</Button> */}
        </FormControl>
      </Box>
    </>
  );
});
