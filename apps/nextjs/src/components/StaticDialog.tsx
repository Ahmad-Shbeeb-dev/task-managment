"use client";

import { Dispatch, SetStateAction } from "react";

import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";

interface Props {
  staticDialogOpen: boolean;
  setStaticDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export const StaticDialog = ({
  staticDialogOpen,
  setStaticDialogOpen,
}: Props) => {
  return (
    <Dialog open={staticDialogOpen} onOpenChange={setStaticDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Please keep at least one activity as a default
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full justify-between">
          <Button
            onClick={() => {
              setStaticDialogOpen(false);
            }}
            className="hover:bg-grreen-400 ml-auto bg-green-500"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
