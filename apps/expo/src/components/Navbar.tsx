import React, { useState } from "react";
import {
  BellIcon,
  Box,
  Button,
  ButtonIcon,
  Text,
  View,
} from "@gluestack-ui/themed";

import { SideNavigation } from "./SideNavigation";

export const Navbar = () => {
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);

  return (
    <View flexDirection="row" justifyContent="space-between">
      <SideNavigation
        handleClose={handleClose}
        showActionsheet={showActionsheet}
      />
      <Text alignSelf="center">Home</Text>
      <Box>
        <Button
          onPress={() => {
            console.log("Bell Pressed");
          }}
          w="$px"
          style={{ backgroundColor: "transparent" }}
        >
          <ButtonIcon as={BellIcon} color="$black" size="xl" />
        </Button>
      </Box>
    </View>
  );
};
