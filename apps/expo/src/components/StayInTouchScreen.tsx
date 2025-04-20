import { Link } from "expo-router";
import { Box, Button, ButtonText, Center, Text } from "@gluestack-ui/themed";
import StayInTouch from "assets/definition.svg";

export const StayInTouchScreen = () => {
  return (
    <Box
      bgColor="#7BC9EF"
      h="$full"
      $base-flexDirection="column"
      $lg-flexDirection="row"
    >
      <Box w="$full" mt="-$12" ml="-$20" $lg-h="$full" $lg-w="$1/2">
        <StayInTouch width={547} />
      </Box>
      <Center w="$full" h="$2/5" $lg-h="$full" $lg-w="$1/2" px="$10">
        <Text w="$full" color="$white" fontFamily="$titan" size="4xl" mb="$3">
          Stay In Touch
        </Text>
        <Text color="$white" textAlign="left" mb="$8">
          and deepen your connection with your child&apos;s daily journey.
        </Text>
        <Link href="/signin/" asChild>
          <Button w={302} h={50} bgColor="$white" borderRadius="$lg">
            <ButtonText color="$black">Next</ButtonText>
          </Button>
        </Link>
      </Center>
    </Box>
  );
};
