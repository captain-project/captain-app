import { promises as fs } from "fs";
import { join, parse } from "path";
const svgo = require("svgo").optimize;
const sharp = require("sharp");

interface SvgoResult {
  data: string; // the optimized svg
  info: {
    // { width: '576', height: '528' }
    width: string;
    height: string;
  };
}

export async function optimizeSVG(inputPath: string, outputPath?: string) {
  const svgString = await fs.readFile(inputPath);
  const result: SvgoResult = svgo(svgString, {
    path: inputPath,
  });
  await fs.writeFile(outputPath ?? inputPath, result.data);
}

export async function createThumbnail(
  inputPath: string,
  format: "jpg" | "webp" = "jpg"
) {
  const { dir, name } = parse(inputPath);
  const outputPath = `${join(dir, name)}-thumbnail.${format}`;
  await sharp(inputPath).resize({ quality: 10 }).toFile(outputPath);
  return outputPath;
}
