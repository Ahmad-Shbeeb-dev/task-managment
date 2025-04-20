import type { SvgProps } from "react-native-svg";
import { Link } from "expo-router";
import { Box, Button, Text } from "@gluestack-ui/themed";

interface Props {
  title: string;
  ImgSource: React.FC<SvgProps>;
  imgbgColor: string;
  linkHref: string;
}
export const SectionLink = ({
  ImgSource,
  imgbgColor,
  title,
  // linkHref,
}: Props) => {
  return (
    <Link href={"/signin/"} asChild>
      <Button
        w={78}
        h={110}
        mr={10}
        p={14}
        bgColor="$white"
        display="flex"
        flexDirection="column"
        borderRadius="$xl"
        justifyContent="space-between"
        softShadow="1"
      >
        <Box
          bgColor={imgbgColor}
          w={50}
          h={50}
          borderRadius="$xl"
          alignItems="center"
          justifyContent="center"
          p={10}
        >
          <ImgSource />
        </Box>
        <Text fontSize="$xs" textAlign="center" w={55} lineHeight={13}>
          {"\n"}
          {title}
        </Text>
      </Button>
    </Link>
  );
};
