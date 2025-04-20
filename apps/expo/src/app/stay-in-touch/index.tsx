import { Stack } from "expo-router";
import { Box } from "@gluestack-ui/themed";

import { StayInTouchScreen } from "~/components/StayInTouchScreen";

export default function Index() {
  return (
    <Box>
      <Stack.Screen
        options={{
          headerTitle: "stay",
          animation: "slide_from_right",
          statusBarColor: "#00000060",
          statusBarTranslucent: true,
        }}
      />
      <StayInTouchScreen />
    </Box>
  );
}
