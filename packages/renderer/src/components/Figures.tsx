import React, { useState } from "react";
import {
  // Icon,
  // SimpleGrid,
  Image as ChakraImage,
  HStack,
  // IconButton,
  // ButtonGroup,
  // Text,
  Flex,
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
import type { SkeletonProps } from "@chakra-ui/react";
// import { FaPlay, FaStop } from "react-icons/fa";
// import { FiRefreshCcw } from "react-icons/fi";
// import metaData from "../../figure-metadata.json";
import type { Step, Figure as FigureType } from "../store/ResultStore";
import { observer } from "mobx-react";
import { useStore } from "../store";

const getFigure = (figures: Step[], step: number, plot: number) =>
  figures[step].figures[plot];

// const clamp = (value: number, min: number, max: number) =>
//   Math.min(Math.max(value, min), max);

type FigureProps = SkeletonProps & {
  figure: FigureType;
  thumbnail?: boolean;
};
type HtmlSize = string | number | undefined;

const Figure = observer(
  ({ width, height, maxW, maxH, figure, thumbnail, ...props }: FigureProps) => {
    const store = useStore();
    const isLoading = store.activeResult.simulation.isRunning;
    const speed = isLoading ? undefined : 0;

    const url = thumbnail ? figure.thumbnailUrl : figure.url;
    const isLoaded = url !== "";
    const w = (maxW as HtmlSize) ?? undefined;
    const h = (maxH as HtmlSize) ?? undefined;

    return (
      <Skeleton
        width={width}
        height={height}
        isLoaded={isLoaded}
        speed={speed}
        {...props}
      >
        <ChakraImage htmlWidth={w} htmlHeight={h} src={url} />
      </Skeleton>
    );
  }
);

function Thumbnail({
  figure,
  onClick,
}: {
  figure: FigureType;
  onClick?: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      w="100px"
      title={`${figure.title} (step: ${figure.step}, plot: ${figure.plot}, url: ${figure.url})`}
    >
      <Figure width={50} height={50} figure={figure} thumbnail />
      <div>{figure.title}</div>
    </Box>
  );
}

export default observer(function Figures({ figures }: { figures: Step[] }) {
  const store = useStore();
  const [step, setStep] = useState(1);
  const [plot, setPlot] = useState(0);
  // const [isPlaying, setIsPlaying] = useState(false);

  const numSteps = figures.length;

  // useEffect(() => {
  //   let id = -1;
  //   if (isPlaying) {
  //     id = window.setInterval(() => {
  //       setStep((step) => {
  //         const nextStep = clamp(step, 0, numSteps - 1);
  //         if (nextStep === numSteps - 1) {
  //           window.clearTimeout(id);
  //           setIsPlaying(false);
  //         }
  //         return nextStep;
  //       });
  //     }, 500);
  //   }
  //   return () => {
  //     if (id !== -1) {
  //       window.clearTimeout(id);
  //     }
  //   };
  // }, [isPlaying, numSteps]);

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
      <Flex
        gap={4}
        p={4}
        mx="auto"
        overflowX="scroll"
        fontSize="sm"
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        {selectedFigures.map((figure) => (
          <Thumbnail
            key={figure.key}
            figure={figure}
            onClick={() => onPlotChange(figure.plot)}
          />
        ))}
      </Flex>

      <Box p={4}>
        <Heading as="h2" size="md" letterSpacing="tight" my={0}>
          {selectedFigure.title}
        </Heading>

        <Figure
          width="20vw"
          maxW={400}
          height="20vw"
          maxH={400}
          figure={selectedFigure}
          mt={4}
        />

        <Slider
          aria-label="step"
          min={1}
          max={numSteps}
          value={step}
          onChange={onStepChange}
          focusThumbOnChange={false}
          w="20vw"
          maxW={400}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>

        <HStack spacing="24px">
          {/* <ButtonGroup isAttached variant="outline">
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
            </ButtonGroup> */}
          <NumberInput
            w="100px"
            size="sm"
            // mr="2rem"
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
      </Box>
    </>
  );
});
