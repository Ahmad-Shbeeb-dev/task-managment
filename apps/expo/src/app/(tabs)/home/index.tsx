import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack, ScrollView, Text, View, VStack } from "@gluestack-ui/themed";
import Calendar from "assets/icons/calendar.svg";
import Chart from "assets/icons/chart.svg";
import Event from "assets/icons/event.svg";
import Graph from "assets/icons/graph.svg";
import Meal from "assets/icons/meal.svg";
import PaperClip from "assets/icons/paperclip.svg";
import { format } from "date-fns";
import { nanoid } from "nanoid/non-secure";

import { api } from "~/utils/api";
import { useAuth } from "~/utils/auth";
import { HomeCarousel } from "~/components/HomeCarousel";
import { HomeHeader } from "~/components/HomeHeader";
import { HomeNewsCard } from "~/components/HomeNewsCard";
import { SectionLink } from "~/components/SectionLink";
import { TaskList } from "~/components/tasks/TaskList";

const CARDS = [
  {
    header: "New Photos",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, odio.",
    date: new Date(),
    backgroundColor: "#EBEBEB",
    dividerIconColor: "#383838",
    images: [
      "https://s3-alpha-sig.figma.com/img/8762/92ee/94f28ed851ea1d722f991d6e5be8808b?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=q16Kpcogsm5kXE3qRC9c1ely8OqDGgYBowSuPd6MiGD8i2wRAv7CZcsjJWInJbiRBUdLUld~Anuo6El2ukfLHF5bIAm0lvVUNvPjxlgOLL6H1YJEXjJWlewyf-gEVp-JTPcRLM21ANPnbnWb2Hjykpl603YP9ZJCYJOexkoUl-BwE6Qe9N-UGEsSvNiN8JXF2GnTdBcWVa9TcE20zNL0BBlR1WPiHDbeafxn2SQ~nOW2j8ZkwZ8eOCMpKR~wXzP7jylwWREsLChOTAJRiy5~GPXVYefwCS7Kx5EdLhgtnIFYOhLO0LzSDn1hJpB4HAuRN6IWlflBBFiRj3B~CSANjQ__",
      "https://s3-alpha-sig.figma.com/img/7ba4/1ea1/7a06244dab07c2b793be873b086802d4?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Z53HU1yWGChWCELmqtbY6qU~WhC9UYocjzIpRdk2RZ~L1BMhwU2vK9M7hjtcOuiDjb12bq0~q2OBABtKNolbiMojTvdSDQUiZ4of5kxyxVyNOzcGvbjzWOmkcUaNvyF~k1TqQzTIVEnGSnfNzm2PUPyGkgeujQBZXSBZUUmsFTxV5kvnnM9cW2bKUzKTGP7mdFIx--EOZeLd8lMgDtyfAJ9PYZjA1zFXa0WPFnnG1NKwSAi~huWrzL5BaIvrcD4ter5BTCENE0cfKofIwTqTYV76KYvJnjgWNCYu12cXEDIgD9DH2fII9Se3f37GxFeaRIn7kt1-G6lnrYX1VblxwA__",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      "https://s3-alpha-sig.figma.com/img/7ba4/1ea1/7a06244dab07c2b793be873b086802d4?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Z53HU1yWGChWCELmqtbY6qU~WhC9UYocjzIpRdk2RZ~L1BMhwU2vK9M7hjtcOuiDjb12bq0~q2OBABtKNolbiMojTvdSDQUiZ4of5kxyxVyNOzcGvbjzWOmkcUaNvyF~k1TqQzTIVEnGSnfNzm2PUPyGkgeujQBZXSBZUUmsFTxV5kvnnM9cW2bKUzKTGP7mdFIx--EOZeLd8lMgDtyfAJ9PYZjA1zFXa0WPFnnG1NKwSAi~huWrzL5BaIvrcD4ter5BTCENE0cfKofIwTqTYV76KYvJnjgWNCYu12cXEDIgD9DH2fII9Se3f37GxFeaRIn7kt1-G6lnrYX1VblxwA__",
    ] as string[],
  },
] as const;

export default function HomeScreen() {
  const session = useAuth();

  const { data: User } = api.child.getUserChildren.useQuery({
    userId: session?.user.id ?? "",
  });

  const userHasChildren =
    (User?.Parent?.ParentChildren && User.Parent.ParentChildren.length > 0) ??
    false;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <ScrollView>
        <HomeHeader />
        <Text fontSize="$sm" color="#777" ml={22}>
          Recommended courses
        </Text>
        <HomeCarousel />
        <Text fontSize="$sm" color="#777" ml={22} mt="$4">
          Keep in touch with your child
        </Text>
        <ScrollView flexDirection="row" py={5} horizontal ml={22} h={130}>
          <SectionLink
            ImgSource={Graph}
            imgbgColor="#C1E2F4"
            title="Reports"
            linkHref=""
          />
          <SectionLink
            ImgSource={PaperClip}
            imgbgColor="#D5FFA9"
            title="Supplies"
            linkHref=""
          />
          <SectionLink
            ImgSource={Event}
            imgbgColor="#FECECD"
            title="Events"
            linkHref=""
          />
          <SectionLink
            ImgSource={Meal}
            imgbgColor="#FFE4A7"
            title="Meal Plan"
            linkHref=""
          />
          <SectionLink
            ImgSource={Calendar}
            imgbgColor="#B4C2F8"
            title="Activities Program"
            linkHref=""
          />
        </ScrollView>

        <HStack px="$4.5" justifyContent="space-between" alignItems="center">
          <VStack>
            <Text color="$black">Today's News</Text>
            <Text size="xs" color="#7C7C7C">
              {format(new Date(), "EEEE, d LLL")}
            </Text>
          </VStack>
          <Chart />
        </HStack>
        {/* {Attendances?.map((card) => <HomeNewsCard key={nanoid()} {...card} />)} */}
      </ScrollView>
    </SafeAreaView>
  );
}
