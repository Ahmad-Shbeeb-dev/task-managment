import { useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { Box, View } from "@gluestack-ui/themed";

import { content } from "./CarouselContent";
import { CarouselItem } from "./CarouselItem";
import { CarouselPaginationItem } from "./CarouselPaginationItem";

export const HomeCarousel = () => {
  const progressValue = useSharedValue<number>(0);
  const windowDimensions = useWindowDimensions();
  return (
    <Box justifyContent="center" ml={20}>
      <Carousel
        // the extra value to decrease space between the cards
        // width={windowDimensions.width - 20}
        width={346}
        height={140}
        vertical={false}
        style={
          {
            // width: "100%",
            // paddingLeft: 50,
          }
        }
        loop
        pagingEnabled={true}
        snapEnabled={true}
        autoPlay={true}
        autoPlayInterval={4000}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.87,
          parallaxScrollingOffset: 50,
        }}
        data={content}
        renderItem={({ item }) => <CarouselItem item={item} />}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 34,
          alignSelf: "center",
        }}
      >
        {content.map((data, index) => {
          return (
            <CarouselPaginationItem
              backgroundColor={data.bgColor}
              animValue={progressValue}
              index={index}
              key={index}
              length={content.length}
            />
          );
        })}
      </View>
    </Box>
  );
};
