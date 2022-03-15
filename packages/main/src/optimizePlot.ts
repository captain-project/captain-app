import { promises as fs } from "fs";
import { join, parse } from "path";
import type {
  SimulationProgressData,
  OptimizedSimulationProgressData,
} from "/shared/types";
import { optimize as svgo } from "svgo";
import type { OptimizedSvg, OptimizedError } from "svgo";
import paths from "./paths";
const sharp = require("sharp");

export async function optimizeSVG(inputPath: string, outputPath?: string) {
  try {
    const svgString = await fs.readFile(inputPath);
    const result: OptimizedSvg | OptimizedError = svgo(svgString, {
      path: inputPath,
    });
    if ("data" in result) {
      await fs.writeFile(outputPath ?? inputPath, result.data);
      return;
    }
    throw new Error(`SVGO error on '${inputPath}': ${result.error}`);
  } catch (err: any) {
    console.error(`SVGO error on '${inputPath}'`, err);
  }
}

export async function createThumbnail(
  inputPath: string,
  format: "jpg" | "webp" = "jpg",
  height = 100
) {
  const { dir, name } = parse(inputPath);
  const outputPath = `${join(dir, name)}-thumbnail.${format}`;
  await sharp(inputPath).resize({ height }).toFile(outputPath);
  return outputPath;
}

export async function optimizePlotData(data: SimulationProgressData) {
  data.filename = paths.getAbsolutePathFromPython(data.filename);
  await optimizeSVG(data.filename);
  data.svgUrl = paths.pythonFilenameToUrl(data.filename);

  const thumbnailPath = await createThumbnail(data.filename);
  data.thumbnailUrl = paths.pythonFilenameToUrl(thumbnailPath);

  return data as OptimizedSimulationProgressData;
}
