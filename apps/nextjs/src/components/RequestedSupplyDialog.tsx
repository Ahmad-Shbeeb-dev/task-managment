import type { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import { toast } from "sonner";

import { api } from "~/utils/api";
import type { ChildType } from "~/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion";
import { Checkbox } from "./ui/Checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";
import { Input } from "./ui/Input";

interface Props {
  isRequestedSupplyOpen: boolean;
  setRequestedSupplyOpen: Dispatch<SetStateAction<boolean>>;
  childSuppliesData?: ChildType["Child"]["ChildSupplies"];
}
export const RequestedSupplyDialog = ({
  isRequestedSupplyOpen,
  setRequestedSupplyOpen,
  childSuppliesData,
}: Props) => {
  const { data: supplyNames } = api.child.getAllSupplies.useQuery(undefined, {
    // enabled: isSupplyFormOpen,
    // refetchOnMount: false,
    onSuccess(data) {
      if (!data || data?.length === 0) {
        toast.error("Please add supplies first!!");
      }
    },
  });

  return (
    <Dialog open={isRequestedSupplyOpen} onOpenChange={setRequestedSupplyOpen}>
      <DialogContent className="px-0 pb-2 pt-0 sm:max-w-[425px]">
        <DialogHeader className="rounded-t-lg bg-lime-400 p-3 text-white">
          <DialogTitle className="mx-1">
            Requested Supplies for{" "}
            {childSuppliesData ? childSuppliesData[0]?.Child.nameEn : ""}
          </DialogTitle>
        </DialogHeader>
        <Accordion
          type="single"
          collapsible
          className="mx-1 w-full space-y-3 px-3"
        >
          {childSuppliesData?.map((childSupply) => (
            <AccordionItem key={nanoid()} value={childSupply.Supply.id}>
              <AccordionTrigger>
                <p>{format(childSupply.giveDate, "dd/MM/yyyy hh:mm a")}</p>
              </AccordionTrigger>
              <AccordionContent>
                {supplyNames?.map((supply) => (
                  <div key={nanoid()} className="space-y-0">
                    <div className="flex h-8 flex-row items-center justify-start space-x-3 space-y-0 rounded-lg border-2 p-2 shadow-md">
                      <Checkbox
                        disabled
                        className="border-slate-400 data-[state=checked]:border-sky-500/75 data-[state=checked]:bg-sky-500/75"
                        defaultChecked={childSupply.Supply.id === supply.id}
                      />
                      <p className="font-normal hover:cursor-pointer">
                        {supply.name}
                      </p>
                    </div>
                    {childSupply.Supply.id === supply.id &&
                      childSupply.note && (
                        <div className="mx-auto w-11/12 rounded-lg border-2 shadow-md">
                          <Input
                            disabled
                            placeholder="Add Note"
                            defaultValue={childSupply.note}
                            className="h-9"
                          />
                        </div>
                      )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
};
