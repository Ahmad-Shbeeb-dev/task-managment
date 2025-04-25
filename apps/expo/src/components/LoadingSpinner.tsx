import { Center, Spinner } from "@gluestack-ui/themed";

import { useTheme } from "~/utils/ThemeProvider";

export const LoadingSpinner = () => {
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? "#1F2937" : "#FFFFFF";

  return (
    <Center flex={1} bg={bgColor}>
      <Spinner size="large" />
    </Center>
  );
};
