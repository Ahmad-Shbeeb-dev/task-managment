import { useLayoutEffect, useState } from "react";
import { Link } from "expo-router";
import {
  addOrientationChangeListener,
  getOrientationAsync,
  Orientation,
  removeOrientationChangeListener,
} from "expo-screen-orientation";
import { Box, Button, ButtonText, Center, Text } from "@gluestack-ui/themed";
import Welcome from "assets/welcome.svg";
import WelcomeHorizontal from "assets/welcomeHorizontal.svg";

export const WelcomeScreen = () => {
  const [orientaion, setOrientation] = useState<"portrait" | "landscape">(
    "portrait",
  );

  useLayoutEffect(() => {
    async function getOrientation() {
      const screenOrientation = await getOrientationAsync(); // 1 ,2= protrait , 3,4 = landscape
      if (
        screenOrientation === Orientation.PORTRAIT_UP ||
        screenOrientation === Orientation.PORTRAIT_DOWN
      ) {
        setOrientation("portrait");
      } else {
        setOrientation("landscape");
      }
    }
    void getOrientation();
    const subscribe = addOrientationChangeListener(getOrientation);

    return () => {
      removeOrientationChangeListener(subscribe);
    };
  }, []);

  return orientaion === "portrait" ? (
    <Box bgColor="#7BC9EF" height="$full" flexDirection="column">
      <Center pt="$1/6" w="$full" h="$1/2">
        <Text
          color="$white"
          fontFamily="$titan"
          size="4xl"
          textAlign="center"
          minHeight="$24"
          mb={87}
        >
          Welcome To Kindergarten
        </Text>

        <Link href="/stay-in-touch/" asChild>
          <Button w={302} h={50} bgColor="$white" borderRadius="$lg">
            <ButtonText color="$black">Let&apos;s get started</ButtonText>
          </Button>
        </Link>
      </Center>
      <Box w="$full" h="$1/2">
        <Welcome width="100%" height="100%" />
      </Box>
    </Box>
  ) : (
    <Box bgColor="#7BC9EF" height="$full">
      <Box>
        <WelcomeHorizontal style={{ position: "absolute" }} />
        <Box pt="$1/6" pl="auto" w="$1/3" h="$full" alignSelf="flex-end">
          <Text
            color="$white"
            fontWeight="$bold"
            size="4xl"
            textAlign="center"
            minHeight="$24"
            mb="$8"
          >
            Welcome To Kindergarten
          </Text>

          <Link href="/stay-in-touch/" asChild>
            <Button w={302} h={50} bgColor="$white" borderRadius="$lg">
              <ButtonText color="$black">Let&apos;s get started</ButtonText>
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
