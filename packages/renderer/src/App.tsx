import React from "react";
import { Box, Grid, GridItem, Button } from "@chakra-ui/react";

export default function App() {
  return (
    <Grid
      h="100vh"
      bg="gray.100"
      templateRows="2fr 1fr"
      templateColumns="1fr 1fr"
    >
      <GridItem borderColor="gray.300" borderWidth={1}>
        <Input />
      </GridItem>
      <GridItem borderColor="gray.300" borderWidth={1}>
        <Output />
      </GridItem>
      <GridItem borderColor="gray.300" borderWidth={1} colSpan={2}>
        <Console />
      </GridItem>
    </Grid>
  );
}

function Input() {
  return (
    <>
      <GridHeader label="Input" />
      <Button>Open file...</Button>
    </>
  );
}

function Output() {
  return (
    <>
      <GridHeader label="Output" />
    </>
  );
}

function Console() {
  return (
    <>
      <GridHeader label="Console" />
      <Box overflow="scroll" maxHeight="33vh" w="100%" fontSize="sm">
        <code>
          <pre>
            {`{
  "name": "vite-electron-builder",
  "private": true,
  "engines": {
    "node": ">=v16.13",
    "npm": ">=8.1"
  },
  "main": "packages/main/dist/index.cjs",
  "scripts": {
    "build": "node scripts/build.js",
    "precompile": "cross-env MODE=production npm run build",
    "compile": "electron-builder build --config .electron-builder.config.js --dir --config.asar=false",
    "pretest": "npm run build",
    "test": "node tests/app.spec.js",
    "watch": "node scripts/watch.js",
    "lint": "eslint . --ext js,ts,tsx",
    "typecheck-main": "tsc --noEmit -p packages/main/tsconfig.json",
    "typecheck-preload": "tsc --noEmit -p packages/preload/tsconfig.json",
    "typecheck-renderer": "tsc --noEmit -p packages/renderer/tsconfig.json",
    "typecheck": "npm run typecheck-main && npm run typecheck-preload && npm run typecheck-renderer",
    "pretypecheck-renderer": "dts-cb -i packages/preload/src/**/*.ts -o packages/preload/exposedInMainWorld.d.ts"
  },
  "devDependencies": {
    "@types/electron-devtools-installer": "2.2.1",
    "@types/react": "^17.0.38",
    "@types/react-dom": "^17.0.11",
    "@typescript-eslint/eslint-plugin": "5.8.0",
    "@vitejs/plugin-react": "^1.1.3",
    "cross-env": "7.0.3",
    "dts-for-context-bridge": "0.7.1",
    "electron": "16.0.5",
    "electron-builder": "22.14.5",
    "electron-devtools-installer": "3.2.0",
    "eslint": "8.5.0",
    "eslint-plugin-react": "^7.28.0",
    "nano-staged": "0.5.0",
    "simple-git-hooks": "2.7.0",
    "typescript": "4.5.4",
    "vite": "2.7.7"
  },
  "dependencies": {
    "@chakra-ui/react": "^1.7.3",
    "@emotion/react": "^11.7.1",
    "@emotion/styled": "^11.6.0",
    "@typescript-eslint/parser": "^5.8.0",
    "electron-updater": "4.6.5",
    "framer-motion": "^5.5.5",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-router-dom": "^6.2.1"
  }
}`}
          </pre>
        </code>
      </Box>
    </>
  );
}

function GridHeader({ label }: { label: string }) {
  return (
    <Box
      px="0.3rem"
      py="0.2rem"
      fontSize="xs"
      fontWeight={700}
      letterSpacing="tight"
      bg="gray.300"
      color="gray.800"
    >
      {label}
    </Box>
  );
}
