import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  Box,
  Button,
  ButtonIcon,
  MenuIcon,
} from "@gluestack-ui/themed";

interface Props {
  showActionsheet: boolean;
  handleClose: () => void;
}
export const SideNavigation = ({ showActionsheet, handleClose }: Props) => {
  return (
    <Box>
      <Button
        onPress={handleClose}
        w="$px"
        style={{ backgroundColor: "transparent" }}
      >
        <ButtonIcon as={MenuIcon} color="$black" size="xl" />
      </Button>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        zIndex={999}
        snapPoints={[100]} // 100% screen height
        w="$1/2"
      >
        <ActionsheetBackdrop // overlay
          w={9999} // width full doesn't take full screen
          overflow="hidden"
        />
        <ActionsheetContent
          h="$full"
          zIndex={999}
          borderTopLeftRadius={0}
          borderTopRightRadius={0}
        >
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Delete</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Share</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Play</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Favourite</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Cancel</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </Box>
  );
};
