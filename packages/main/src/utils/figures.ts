export const FIG_TITLES = [
  "Species richness",
  "Mean population density",
  "Total population size",
  "Phylogenetic diversity",
  "Disturbance",
  "Selective disturbance",
  "Mean annual temperature",
  "Economic loss",
  "Cost of protecting",
  "Variables through time",
];

export function getFigTitle(index: number) {
  if (index < FIG_TITLES.length) {
    return FIG_TITLES[index];
  }
  return `Sp. ${index - FIG_TITLES.length}`;
}

interface FigData {
  numSpecies: number;
  numTimeSteps: number;
}

export function getNumFiguresPerStep({
  numSpecies,
}: Pick<FigData, "numSpecies">) {
  return FIG_TITLES.length + numSpecies;
}

export function getNumFiguresTotal({
  numSpecies,
  numTimeSteps,
}: Pick<FigData, "numSpecies" | "numTimeSteps">) {
  return getNumFiguresPerStep({ numSpecies }) * (numTimeSteps + 1);
}
