import React from "react";
import { Grid, GridItem, chakra } from "@chakra-ui/react";
import type { GridItemProps } from "@chakra-ui/react";
import Output from "./components/Output";
import Console from "./components/Console";
import Input from "./components/Input";

// const TabbedApp = () => (
//   <Tabs
//     variant="enclosed"
//     onChange={store.setTabIndex}
//     index={store.tabIndex}
//   >
//     <TabList>
//       {store.results.map((result, i) => (
//         <Tab selected={store.tabIndex === i} key={i} pr={2}>
//           {result.name}
//           <Icon
//             ml={2}
//             mr={0}
//             color="transparent"
//             transition="all 0.3s"
//             _hover={{
//               color: "gray.600",
//             }}
//             as={AiOutlineClose}
//             onClick={() => store.remove(i)}
//           />
//         </Tab>
//       ))}
//     </TabList>
//     <TabPanels>
//       {store.results.map((result, i) => (
//         <TabPanel key={i}>
//           <Result result={result} />
//         </TabPanel>
//       ))}
//     </TabPanels>
//   </Tabs>
// );

const Item = chakra(GridItem, {
  baseStyle: {
    borderColor: "gray.300",
    borderWidth: 1,
  },
});

export default function App() {
  return (
    <Grid
      h="100vh"
      bg="white"
      templateColumns="1fr 2fr"
      templateRows="1fr max-content"
    >
      <Item minH="67vh" maxH="100vh" overflow="scroll">
        <Input />
      </Item>
      <Item minH="67vh" maxH="100vh" overflow="scroll">
        <Output />
      </Item>
      <Item maxH="33vh" minH={0} colSpan={2}>
        <Console />
      </Item>
    </Grid>
  );
}
