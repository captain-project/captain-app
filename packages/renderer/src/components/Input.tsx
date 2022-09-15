import React from "react";
import type { PropsWithChildren } from "react";
import {
  Button,
  Select,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  VStack,
  chakra,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import type { FormControlProps, NumberInputProps } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useStore } from "../store";
import GridHeader from "./GridHeader";
// import Test from "./Test";
import { policies } from "../store/SimulationStore";
import type { PolicyValue } from "../store/SimulationStore";

type NumberInputFormProps = Omit<
  NumberInputProps & FormControlProps,
  "onChange"
> & {
  label: string;
  onChange: (value: number) => void;
};

const NumberInputForm = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: PropsWithChildren<NumberInputFormProps>) => {
  return (
    <FormControl as={HStack} spacing={2} justify="space-between" {...props}>
      <FormLabel>{label}</FormLabel>
      <NumberInput
        size="sm"
        w="200px"
        maxW="50%"
        max={max}
        min={min}
        step={step}
        value={value}
        onChange={(_, value) => onChange(value)}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  );
};

const HiglightedTr = chakra(Tr, {
  baseStyle: {
    "&:hover": {
      backgroundColor: "gray.200",
    },
  },
});

const NumericTh = (props: any) => <Th isNumeric {...props} />;
const NumericTd = (props: any) => <Td isNumeric {...props} />;

const LoadSystem = observer(function LoadSystem({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const store = useStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Load Initialized System</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table variant="simple" size="sm">
            <TableCaption>Load pre-initialized systems</TableCaption>
            <Thead>
              <Tr>
                <NumericTh>Species</NumericTh>
                <NumericTh>Grid size</NumericTh>
                <NumericTh>Cell capacity</NumericTh>
              </Tr>
            </Thead>
            <Tbody>
              {store.activeResult.simulation.initiatedSystemsValues.map(
                (system) => (
                  <HiglightedTr
                    key={system.name}
                    onClick={() => {
                      const { simulation } = store.activeResult;
                      simulation.setNumSpecies(system.numSpecies);
                      simulation.setGridSize(system.gridSize);
                      simulation.setCellCapacity(system.cellCapacity);
                      onClose();
                    }}
                  >
                    <NumericTd>{system.numSpecies}</NumericTd>
                    <NumericTd>{system.gridSize}</NumericTd>
                    <NumericTd>{system.cellCapacity}</NumericTd>
                  </HiglightedTr>
                )
              )}
            </Tbody>
          </Table>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default observer(function Input() {
  const store = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <GridHeader label="Input" />

      <VStack p={2} spacing={2}>
        <Button onClick={onOpen}>Load system</Button>
        <div>or</div>
        <Button
          isDisabled={
            store.activeResult.simulation.isLoadingClient ||
            store.activeResult.simulation.isInitiated ||
            store.activeResult.simulation.isRunning
          }
          isLoading={store.activeResult.simulation.isInitiating}
          onClick={() => store.activeResult.simulation.init()}
        >
          Init system
        </Button>

        <LoadSystem isOpen={isOpen} onClose={onClose} />

        <NumberInputForm
          label="Number of species"
          min={5}
          max={50}
          value={store.activeResult.simulation.numSpecies}
          onChange={(value) => {
            store.activeResult.simulation.setNumSpecies(value);
          }}
        />
        <NumberInputForm
          label="Grid size"
          min={10}
          max={100}
          value={store.activeResult.simulation.gridSize}
          onChange={(value) => {
            store.activeResult.simulation.setGridSize(value);
          }}
        />
        <NumberInputForm
          label="Cell capacity"
          min={5}
          max={60}
          value={store.activeResult.simulation.cellCapacity}
          onChange={(value) => {
            store.activeResult.simulation.setCellCapacity(value);
          }}
        />
      </VStack>

      <VStack p={2} spacing={2}>
        <NumberInputForm
          label="Time steps"
          min={1}
          max={20}
          value={store.activeResult.simulation.numTimeSteps}
          onChange={(value) => {
            store.activeResult.simulation.setNumSteps(value);
          }}
        />
        <NumberInputForm
          label="Dispersal rate"
          min={0}
          max={1}
          step={0.1}
          value={store.activeResult.simulation.dispersalRate}
          onChange={(value) => {
            store.activeResult.simulation.setDispersalRate(value);
          }}
        />

        <FormControl as={HStack} spacing={2} justify="space-between">
          <FormLabel>Policy</FormLabel>
          <Select
            size="sm"
            w="200px"
            maxW="50%"
            value={store.activeResult.simulation.policy}
            onChange={(e) => {
              store.activeResult.simulation.setPolicy(
                e.target.value as PolicyValue
              );
            }}
          >
            {policies.map(({ value, name }) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button
          disabled={
            store.activeResult.simulation.isLoadingClient ||
            !store.activeResult.simulation.isInitiated
          }
          isLoading={store.activeResult.simulation.isRunning}
          onClick={() => store.activeResult.simulation.run()}
        >
          Run simulation
        </Button>

        {/* <Test /> */}
      </VStack>
    </>
  );
});
