import React from "react";
import {
  BellIcon,
  Tabs,
  TabsTab,
  TabsTabIcon,
  TabsTabList,
  TabsTabTitle,
} from "@gluestack-ui/themed";

export const NavigationTabs = () => {
  return (
    <Tabs value="tab1" position="fixed" left={0} bottom={0}>
      <TabsTabList
        borderRadius="$none"
        bgColor="$red200"
        width="$full"
        flexDirection="row"
        justifyContent="space-between"
      >
        <TabsTab
          value="tab1"
          onPress={() => {
            console.log("tab1");
          }}
          flexDirection="row"
        >
          <TabsTabIcon as={BellIcon} />
          <TabsTabTitle>Tab 1</TabsTabTitle>
        </TabsTab>
        <TabsTab
          value="tab2"
          onPress={() => {
            console.log("tab2");
          }}
          flexDirection="row"
        >
          <TabsTabIcon as={BellIcon} />
          <TabsTabTitle>Tab 2</TabsTabTitle>
        </TabsTab>
        <TabsTab
          value="tab3"
          onPress={() => {
            console.log("tab3");
          }}
          flexDirection="row"
        >
          <TabsTabIcon as={BellIcon} />
          <TabsTabTitle>Tab 2</TabsTabTitle>
        </TabsTab>
      </TabsTabList>
    </Tabs>
  );
};
