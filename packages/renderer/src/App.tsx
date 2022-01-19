import React from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";
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

export default function App() {
  return (
    <Grid
      h="100vh"
      bg="white"
      //templateRows="2fr 1fr"
      templateColumns="1fr 1fr"
    >
      <GridItem borderColor="gray.300" borderWidth={1}>
        <Input />
      </GridItem>
      <GridItem borderColor="gray.300" borderWidth={1}>
        <Output />
      </GridItem>
      {/* <GridItem borderColor="gray.300" borderWidth={1} colSpan={2}>
        <Console />
      </GridItem> */}
    </Grid>
  );
}
