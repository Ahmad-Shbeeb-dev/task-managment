import { Box, Text } from "@gluestack-ui/themed";

import type { CarouselContent } from "./CarouselContent";

interface Props {
  item: CarouselContent;
}
export const CarouselItem = ({ item }: Props) => {
  return (
    <Box>
      <item.bgImage style={{ position: "absolute" }} />
      <Box
        w="60%"
        marginLeft={24}
        marginRight={17}
        alignSelf={item.textAlign === "left" ? "flex-start" : "flex-end"}
      >
        <Text
          mb="$2.5"
          mt={27}
          color="$white"
          fontWeight="$bold"
          fontSize="$lg"
        >
          {item.header}
        </Text>
        <Text color="$white" fontSize={13}>
          {item.content}
        </Text>
      </Box>
    </Box>
  );
};
