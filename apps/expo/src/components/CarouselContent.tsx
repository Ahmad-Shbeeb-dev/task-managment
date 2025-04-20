import type { SvgProps } from "react-native-svg";
import NewClass from "assets/newClass.svg";
import NewEvent from "assets/newEvent.svg";
import NewUpdates from "assets/newUpdates.svg";

export const content: CarouselContent[] = [
  {
    index: 0,
    bgColor: "#9998EF",
    header: "New Event",
    content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
    bgImage: NewEvent,
    textAlign: "left",
  },
  {
    index: 1,
    bgColor: "#95D354",
    header: "New Updates",
    content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
    bgImage: NewUpdates,
    textAlign: "right",
  },
  {
    index: 2,
    bgColor: "#42B0ED",
    header: "New Class",
    content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
    bgImage: NewClass,
    textAlign: "left",
  },
];

export interface CarouselContent {
  index: number;
  bgColor: string;
  header: string;
  content: string;
  bgImage: React.FC<SvgProps>;
  textAlign: string;
}
