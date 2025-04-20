import { useState } from "react";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Pressable,
  ScrollView,
  Text,
} from "@gluestack-ui/themed";
import { startOfToday } from "date-fns";
import { nanoid } from "nanoid/non-secure";

import { api } from "~/utils/api";
import { useAuth } from "~/utils/auth";

export const HomeHeader = () => {
  const session = useAuth();
  const utils = api.useUtils();
  const [childrenIds, setChildrenIds] = useState<string[] | undefined>();
  const { data: User } = api.child.getUserChildren.useQuery({
    userId: session?.user.id ?? "",
  });

  api.child.getChildrenAttendances.useQuery(
    {
      checkInDate: startOfToday(),
      childrenIds: childrenIds,
    },
    {
      onSuccess: (data) => {
        utils.child.getChildrenAttendances.setData(
          {
            checkInDate: startOfToday(),
            childrenIds: User?.Parent?.ParentChildren.map(
              (child) => child.childId,
            ),
          },
          data,
        );
      },
    },
  );

  return (
    <Box flexDirection="row" justifyContent="space-between" px="$6" mb="$4.5">
      <Box flex={2}>
        <Text color="#7C7C7C" fontSize="$xs" fontWeight="$normal">
          Hello,
        </Text>
        <Text fontSize="$md" fontWeight="$normal">
          {session?.user.name}👋
        </Text>
      </Box>

      <ScrollView mt="$3" w="$2/6" horizontal transform={[{ scaleX: -1 }]}>
        {User?.Parent?.AllChildren.map((child) => {
          return (
            <Pressable
              // the transform attributes on pressable and
              // scrollView make content from right to left
              transform={[{ scaleX: -1 }]}
              key={nanoid()}
              onPress={() => {
                if (childrenIds?.includes(child.id)) {
                  setChildrenIds((prev) => {
                    if (prev && prev.length > 0) {
                      return [...prev, child.id].filter(
                        (childId) => child.id !== childId,
                      );
                    } else {
                      utils.child.getChildrenAttendances.invalidate();
                      return undefined;
                    }
                  });
                } else {
                  setChildrenIds((prev) =>
                    prev && prev.length > 0 ? [...prev, child.id] : [child.id],
                  );
                }
              }}
            >
              <Avatar
                maxWidth="$full"
                w={33}
                h={33}
                mx={2}
                bgColor="#F0AB25"
                borderColor="$blue300"
                borderWidth={childrenIds?.includes(child.id) ? "$2" : "$0"}
              >
                <AvatarImage alt="img" source={child.image ?? undefined} />
                <AvatarFallbackText>
                  {!child.image && child.nameEn}
                </AvatarFallbackText>
              </Avatar>
            </Pressable>
          );
        })}
      </ScrollView>
    </Box>
  );
};
