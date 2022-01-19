import type { SimulationProgressData } from "/shared/types";
import { optimize } from "svgo";
import { promises as fs } from "fs";

interface SvgoResult {
  data: string; // the optimized svg
  info: {
    // { width: '576', height: '528' }
    width: string;
    height: string;
  };
}

export async function optimizePlotData(data: SimulationProgressData) {
  console.log("Optimize data:", data);
  const svg = await fs.readFile(data.filename);
  const result: SvgoResult = optimize(svg, {
    path: data.filename,
  });
  await fs.writeFile(data.filename, result.data);
  return data;

  // optimize svg with svgo and create raster thumbnail
  // progress.data.svg = ...
  // progress.data.thumbnail = ...
}
