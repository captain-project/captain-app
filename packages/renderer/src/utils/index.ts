/**
 * Range generator for iterating the interval [start, stop) with a
 * specified `step` size, default 1.
 * If only one value is provided, it is used as stop value, implicitly setting start to zero.
 * If the `inclusive` option is true, iterate the interval [start, stop].
 *
 * Example usage:
 * for (const i of range(10)) {
 *   console.log(i);
 * }
 *
 *
 * @param start Start value
 * @param stop Stop value, will not yield this but stop before
 * @param step Interval to step
 * @param options Options to use inclusive range
 */

export function* range(
  start: number,
  stop: number | undefined = undefined,
  step = 1,
  options: {
    inclusive: boolean;
  } = { inclusive: false }
) {
  if (stop === undefined) {
    // If only one value provided, use that as stop
    stop = start;
    start = 0;
  }

  if (options.inclusive) {
    for (let i = start; step > 0 ? i <= stop : i >= stop; i += step) {
      yield i;
    }
  } else {
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
      yield i;
    }
  }
}
