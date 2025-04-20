import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import Calendar from "assets/icons/calendar.svg";
import Chart from "assets/icons/chart.svg";
import Event from "assets/icons/event.svg";
import Graph from "assets/icons/graph.svg";
import Meal from "assets/icons/meal.svg";
import PaperClip from "assets/icons/paperclip.svg";
import { format } from "date-fns";

import { HomeCarousel } from "~/components/HomeCarousel";
import { HomeHeader } from "~/components/HomeHeader";
import { HomeNewsCard } from "~/components/HomeNewsCard";
import { SectionLink } from "~/components/SectionLink";

export default function HomeScreen() {
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
      </ScrollView>
    </SafeAreaView>
  );
}
