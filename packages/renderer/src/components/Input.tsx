import React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useStore } from "../store";
import GridHeader from "./GridHeader";

export default observer(function Input() {
  const store = useStore();

  return (
    <>
      <GridHeader label="Input" />
      <FormControl>
        <FormLabel htmlFor="num-species">Number of species</FormLabel>
        <NumberInput
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
        <Button
          isLoading={store.activeResult.simulation.initiating}
          disabled={store.activeResult.simulation.running}
          onClick={store.activeResult.simulation.init}
        >
          Init simulation
        </Button>
        <Button
          disabled={!store.activeResult.simulation.initiated}
          isLoading={store.activeResult.simulation.running}
          onClick={store.activeResult.simulation.run}
        >
          Run simulation
        </Button>
        <Button onClick={() => store.create()}>Test result</Button>
      </FormControl>
    </>
  );
});
