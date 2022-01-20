import React, { useState, useEffect } from "react";
import {
  Icon,
  SimpleGrid,
  Image as ChakraImage,
  HStack,
  IconButton,
  ButtonGroup,
  Text,
  Box,
  Heading,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Skeleton,
} from "@chakra-ui/react";
import { FaPlay, FaStop } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
// import metaData from "../../figure-metadata.json";
import type { Step, Figure as FigureType } from "../store/ResultStore";
import { observer } from "mobx-react";

const getFigure = (figures: Step[], step: number, plot: number) =>
  figures[step].figures[plot];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const Figure = observer(
  ({
    width,
    height,
    figure,
    thumbnail,
  }: {
    width: number;
    height: number;
    figure: FigureType;
    thumbnail?: boolean;
  }) => {
    const url = thumbnail ? figure.thumbnailUrl : figure.url;
    const isLoaded = url !== "";
    return (
      <Skeleton width={width} height={height} isLoaded={isLoaded}>
        <ChakraImage htmlWidth={width} htmlHeight={height} src={url} />
      </Skeleton>
    );
  }
);

const Thumbnail = observer(({ figure }: { figure: FigureType }) => {
  return (
    <div
      title={`${figure.title} (step: ${figure.step}, plot: ${figure.plot}, url: ${figure.url})`}
    >
      <Figure width={50} height={50} figure={figure} thumbnail />
      <div>{figure.title}</div>
    </div>
  );
});

export default function Figures({ figures }: { figures: Step[] }) {
  const [step, setStep] = useState(1);
  const [plot, setPlot] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const numSteps = figures.length;

  useEffect(() => {
    let id = -1;
    if (isPlaying) {
      id = window.setInterval(() => {
        setStep((step) => {
          const nextStep = clamp(step, 0, numSteps - 1);
          if (nextStep === numSteps - 1) {
            window.clearTimeout(id);
            setIsPlaying(false);
          }
          return nextStep;
        });
      }, 500);
    }
    return () => {
      if (id !== -1) {
        window.clearTimeout(id);
      }
    };
  }, [isPlaying, numSteps]);

  // useEffect(function preloadImages() {
  //   for (let step = 1; step <= numSteps; ++step) {
  //     plotIds.forEach((plotId) => {
  //       const image = new Image();
  //       image.src = getImage(step, plotId, "jpg");
  //       // @ts-ignore
  //       window[image.src] = image;
  //     });
  //   }
  // }, []);

  const onStepChange = (value: number) => setStep(value);
  const onPlotChange = (plotId: number) => setPlot(plotId);

  const selectedFigure = getFigure(figures, step - 1, plot);
  const selectedFigures = figures[step - 1].figures.slice(0, 12);

  return (
    <>
      <SimpleGrid
        spacing="40px"
        mb={20}
        mx={{ sm: 4, md: 4, lg: "auto" }}
        px={10}
        columns={{ sm: 1, md: 2 }}
        maxWidth={1000}
      >
        <Box>
          <Figure width={200} height={200} figure={selectedFigure} />
          <HStack spacing="24px">
            <ButtonGroup isAttached variant="outline">
              <IconButton
                colorScheme="blue"
                aria-label="Restart"
                icon={<Icon as={FiRefreshCcw} />}
                fontSize={20}
                isDisabled={step === 1}
                onClick={() => {
                  setIsPlaying(false);
                  setStep(1);
                }}
              />
              <IconButton
                colorScheme="blue"
                aria-label={isPlaying ? "Stop" : "Play"}
                icon={<Icon as={isPlaying ? FaStop : FaPlay} />}
                isActive={isPlaying}
                fontSize={20}
                onClick={() => {
                  if (!isPlaying && step === numSteps) {
                    setStep(1);
                  }
                  setIsPlaying((isPlaying) => !isPlaying);
                }}
              />
            </ButtonGroup>
            <NumberInput
              maxW="100px"
              mr="2rem"
              inputMode="numeric"
              value={step}
              min={1}
              max={numSteps}
              onChange={(_, value) => onStepChange(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
          <Slider
            aria-label="step"
            min={1}
            max={numSteps}
            value={step}
            onChange={onStepChange}
            focusThumbOnChange={false}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Box width={400}>
          <Heading as="h1" size="lg" my={4}>
            {selectedFigure.title}
          </Heading>
          <Text>[Figure description]</Text>
        </Box>
      </SimpleGrid>

      <SimpleGrid
        columns={{ sm: 3, md: 4, lg: 6 }}
        gap={4}
        p={10}
        mb={20}
        mx={{ sm: 4, md: 4, lg: "auto" }}
        maxWidth={1000}
        bgGradient="linear(to-b, gray.50, gray.100)"
        boxShadow="inner"
        rounded="md"
      >
        {selectedFigures.map((figure) => (
          <div key={figure.key} onClick={() => onPlotChange(figure.plot)}>
            <Thumbnail figure={figure} />
          </div>
        ))}
      </SimpleGrid>
    </>
  );
}
