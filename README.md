# Captain App

Cross-platform desktop GUI for [Captain - Conservation Area Prioritization Through Artificial INtelligence](https://www.captain-project.net)

## Development

The code is based on a [React fork](https://github.com/soulsam480/vite-electron-react-starter) of [Vite Electron Builder Boilerplate](https://github.com/cawa-93/vite-electron-builder).

### Requirements

Requires npm version v7 or later.

Copy `trained_models` from `captain-dev` to the `python` folder.

#### Python

Working directory: `captain-project/captain-project`

Create conda environment and install dependencies from `environment.yml`

```
conda create --name captain python==3.9.13
conda activate captain
conda env update --file environment.yml
```

Install local captain-project (later from pip)

```
pip install -e .
```

Use same conda environment when starting electron.

### Running

1. `npm run watch` start electron app in watch mode.
1. `npm run compile` build app but for local debugging only.
1. `npm run lint` lint your code.
1. `npm run typecheck` Run typescript check.
1. `npm run test` Run app test.

### Logs

Captain uses `electron-log` which logs info and errors to a local log file.
On macOS in `~/Library/Logs/captain-app/main.log`.
