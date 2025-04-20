import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
  Box,
  Card,
  Center,
  Divider,
  Heading,
  HStack,
  Image,
  Text,
} from "@gluestack-ui/themed";
import { format } from "date-fns";
import { nanoid } from "nanoid/non-secure";

import { HomeNewsCardProps } from "~/types";

export const HomeNewsCard = (props: HomeNewsCardProps) => {
  const firstImages = props.cardSocialImages?.slice(0, 4);
  const imagesRows =
    firstImages &&
    Array.from({ length: firstImages.length / 2 + (firstImages.length % 2) });

  return (
    <HStack alignItems="center" px="$4.5">
      <Divider
        orientation="vertical"
        mr="$1"
        h="$2/3"
        borderRadius="$lg"
        w="$1"
        bgColor={props.cardDividerIconColor}
      />
      <Card
        size="md"
        variant="filled"
        my="$3"
        p="$3"
        borderRadius="$xl"
        w="$full"
        gap="$1"
        bgColor={props.cardBackgroundColor}
        // bgColor={lightenColor(props.dividerIconColor)}
      >
        <HStack alignItems="center" gap="$2">
          {props.cardTitleIcon && (
            <Box bgColor="$white" borderRadius="$lg" p="$1">
              <props.cardTitleIcon fill={props.cardDividerIconColor} />
            </Box>
          )}
          <Heading fontWeight="$medium" size="sm">
            {props.cardTitle}
          </Heading>
          <Text size="xs" color="$black" ml="auto">
            {props?.cardDate && format(props.cardDate, "hh:mm a")}
          </Text>
        </HStack>
        <Text fontWeight="$light" color="$black" size="xs">
          {props.cardBody}
        </Text>

        {firstImages && firstImages?.length > 0
          ? imagesRows?.map((_, rowIdx) => (
              <Center key={nanoid()} flexDirection="row" h="$24" my="-$2.5">
                {firstImages
                  .slice(rowIdx * 2, rowIdx * 2 + 2)
                  .map((image, idx) => (
                    <Image
                      key={nanoid()}
                      alt="img"
                      source={image}
                      // resizeMode="stretch"
                      // style={{ width: "50%", height: "100%" }}
                      sx={
                        firstImages.length === 1
                          ? {
                              borderRadius: "$xl",
                              w: "$full",
                            }
                          : firstImages.length === 2
                            ? idx % 2 === 0
                              ? {
                                  borderTopLeftRadius: "$xl",
                                  borderBottomLeftRadius: "$xl",
                                  w: "$1/2",
                                }
                              : {
                                  borderTopRightRadius: "$xl",
                                  borderBottomRightRadius: "$xl",
                                  w: "$1/2",
                                }
                            : // even images
                              firstImages.length % 2 === 0
                              ? rowIdx === 0
                                ? idx % 2 === 0
                                  ? {
                                      borderTopLeftRadius: "$xl",
                                      w: "$1/2",
                                    }
                                  : {
                                      borderTopRightRadius: "$xl",
                                      w: "$1/2",
                                    }
                                : rowIdx === imagesRows.length - 1
                                  ? idx % 2 === 0
                                    ? {
                                        borderBottomLeftRadius: "$xl",
                                        w: "$1/2",
                                      }
                                    : {
                                        borderBottomRightRadius: "$xl",
                                        w: "$1/2",
                                      }
                                  : {}
                              : // odd images
                                rowIdx === 0
                                ? idx % 2 === 0
                                  ? {
                                      borderTopLeftRadius: "$xl",
                                      w: "$1/2",
                                    }
                                  : {
                                      borderTopRightRadius: "$xl",
                                      w: "$1/2",
                                    }
                                : rowIdx === imagesRows.length - 1
                                  ? {
                                      borderBottomLeftRadius: "$xl",
                                      borderBottomRightRadius: "$xl",
                                      w: "$full",
                                    }
                                  : {}
                      }
                    />
                  ))}
              </Center>
            ))
          : null}

        {props?.cardChildrenImages && props.cardChildrenImages?.length > 0 ? (
          <AvatarGroup
            bgColor="$white"
            borderRadius="$full"
            mr="auto"
            // alignSelf="flex-start"
            py="$0.5"
            pl="$0.5"
            pr="$3"
            gap="$1"
          >
            {props.cardChildrenImages.map((avatar) => (
              <Avatar
                key={nanoid()}
                bgColor="#F0AB25"
                borderColor="$white"
                borderWidth="$2"
                size="xs"
                borderRadius="$full"
              >
                <AvatarFallbackText>{avatar.nameEn}</AvatarFallbackText>
                <AvatarImage alt="img" source={avatar.image ?? ""} />
              </Avatar>
            ))}
          </AvatarGroup>
        ) : null}
      </Card>
    </HStack>
  );
};
