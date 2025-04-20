"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { Session } from "@acme/auth";

import { api } from "~/utils/api";
import { PageTitleContext } from "~/utils/context";
import { cn } from "~/utils/ui";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { Form } from "~/components/ui/Form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs";
import type { ChildDetailsType, ChildFormInputsType } from "~/types";
import { ChildInfoFormTab } from "./ChildInfoFormTab";
import { ParentInfoFormTab } from "./ParentInfoFormTab";
import { PickupListFormTab } from "./PickupListFormTab";

const TABS = [
  {
    value: "childInfo",
    title: "Child Info",
  },
  {
    value: "parentsInfo",
    title: "Parents Info",
  },
  {
    value: "pickupList",
    title: "Pickup List",
  },
  // {
  //   value: "enrollProgram",
  //   title: "Enrollment Program",
  // },
  // {
  //   value: "summary",
  //   title: "Summary",
  // },
  // {
  //   value: "media",
  //   title: "Media",
  // },
  // {
  //   value: "dailyReports",
  //   title: "Daily Reports",
  // },
] as const;

interface Props {
  childIdParam?: string;
  initialChildDetails?: ChildDetailsType;
  session: Session;
}

type TabsType = (typeof TABS)[number]["value"];

export const AddChildForm = ({
  childIdParam,
  initialChildDetails,
  session,
}: Props) => {
  const router = useRouter();
  const ctx = api.useContext();

  const { setPageTitle } = useContext(PageTitleContext);

  const { data: childDetails } = api.child.getChild.useQuery(
    { childId: childIdParam! },
    {
      enabled: !!childIdParam,
      placeholderData: initialChildDetails,
      onSuccess: (data) => {
        if (data?.nameEn && setPageTitle) {
          setPageTitle(data.nameEn);
        }
      },
    },
  );

  const form = useForm<ChildFormInputsType>({
    // fill form from DB
    values: {
      childId: childDetails?.id ?? undefined,
      childNameEn: childDetails?.nameEn ?? undefined,
      childNameAr: childDetails?.nameAr ?? undefined,
      childFatherName: childDetails?.ParentChildren?.filter(
        (parent) => parent.Parent.gender === "MALE",
      )[0]?.Parent?.userId
        ? childDetails?.ParentChildren?.filter(
            (parent) => parent.Parent.gender === "MALE",
          )[0]?.Parent?.User?.name ?? undefined
        : childDetails?.ParentChildren?.filter(
            (parent) => parent.Parent.gender === "MALE",
          )[0]?.Parent?.parentName ?? undefined,

      childMotherName: childDetails?.ParentChildren?.filter(
        (parent) => parent.Parent.gender === "FEMALE",
      )[0]?.Parent?.userId
        ? childDetails?.ParentChildren?.filter(
            (parent) => parent.Parent.gender === "FEMALE",
          )[0]?.Parent?.User?.name ?? undefined
        : childDetails?.ParentChildren?.filter(
            (parent) => parent.Parent.gender === "FEMALE",
          )[0]?.Parent?.parentName ?? undefined,
      childAllergy: childDetails?.allergy ?? undefined,
      childBloodType: childDetails?.bloodType ?? undefined,
      childDisease: childDetails?.disease ?? undefined,
      childHomeAddress: childDetails?.homeAddress ?? undefined,
      childHomeNumber: childDetails?.homeNumber ?? undefined,
      childMedication: childDetails?.medication ?? undefined,
      childNationality: childDetails?.nationality ?? undefined,
      childNote: childDetails?.note ?? undefined,
      childSurgery: childDetails?.surgery ?? undefined,
      childStartDate: childDetails?.startDate ?? undefined,
      childGender: childDetails?.gender ?? undefined,
      childDateOfBirth: childDetails?.dateOfBirth ?? undefined,
      childLanguages:
        childDetails?.ChildLanguages?.map((language) => language.Language.id) ??
        [],
      childClasses:
        childDetails?.ClassChildren?.map((classs) => classs.Class.id) ?? [],
      childEmergencies: childDetails?.ChildEmergencies?.map(
        (childEmergency) => ({
          emergencyId: childEmergency.id ?? undefined,
          emergencyName: childEmergency.name ?? undefined,
          contactNumber: childEmergency.contactNumber ?? undefined,
          relationToChild: childEmergency.relationToChild ?? undefined,
        }),
      ),
      childSibilings: childDetails?.ChildSibilings?.map((childSibiling) => ({
        id: childSibiling.id ?? undefined,
        name: childSibiling.name ?? undefined,
        age: childSibiling.age ?? null,
        gender: childSibiling.gender ?? null,
        school: childSibiling.school ?? undefined,
      })),
      childPickups: {
        pickupDropOffPeople: childDetails?.ChildPickups?.filter(
          (childPickup) =>
            childPickup.type === "PERSON" &&
            childPickup.action === "PICKUP_DROPOFF",
        ).map((childPickup) => ({
          pickupId: childPickup.id ?? undefined,
          pickupName: childPickup.name ?? undefined,
          contactNumber: childPickup.contactNumber ?? undefined,
          relationToChild: childPickup.relationToChild ?? undefined,
          pickupType: "PERSON",
          pickupAction: "PICKUP_DROPOFF",
        })),

        pickupBuses: childDetails?.ChildPickups?.filter(
          (childPickup) =>
            childPickup.type === "BUS" && childPickup.action === "PICKUP",
        ).map((childPickup) => ({
          pickupId: childPickup.id ?? undefined,
          pickupName: childPickup.name ?? undefined,
          contactNumber: childPickup.contactNumber ?? undefined,
          relationToChild: childPickup.relationToChild ?? undefined,
          pickupType: "BUS",
          pickupAction: "PICKUP",
        })),

        dropOffBuses: childDetails?.ChildPickups?.filter(
          (childPickup) =>
            childPickup.type === "BUS" && childPickup.action === "DROPOFF",
        ).map((childPickup) => ({
          pickupId: childPickup.id ?? undefined,
          pickupName: childPickup.name ?? undefined,
          contactNumber: childPickup.contactNumber ?? undefined,
          relationToChild: childPickup.relationToChild ?? undefined,
          pickupType: "BUS",
          pickupAction: "DROPOFF",
        })),
      },
      fatherId:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "MALE",
        )[0]?.Parent?.id ?? undefined,

      motherId:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "FEMALE",
        )[0]?.Parent?.id ?? undefined,

      fatherNotes:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "MALE",
        )[0]?.Parent?.notes ?? undefined,
      motherNotes:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "FEMALE",
        )[0]?.Parent?.notes ?? undefined,

      fatherOccupation:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "MALE",
        )[0]?.Parent?.occupation ?? undefined,

      motherOccupation:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "FEMALE",
        )[0]?.Parent?.occupation ?? undefined,

      fatherUserId:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "MALE",
        )[0]?.Parent?.userId ?? undefined,

      motherUserId:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "FEMALE",
        )[0]?.Parent?.userId ?? undefined,

      fatherWorkAddress:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "MALE",
        )[0]?.Parent?.workAddress ?? undefined,

      motherWorkAddress:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "FEMALE",
        )[0]?.Parent?.workAddress ?? undefined,

      fatherWorkNumber:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "MALE",
        )[0]?.Parent?.workNumber ?? undefined,

      motherWorkNumber:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "FEMALE",
        )[0]?.Parent?.workNumber ?? undefined,

      fatherContactNumber:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "MALE",
        )[0]?.Parent?.User?.contactNumber ?? undefined,

      motherContactNumber:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "FEMALE",
        )[0]?.Parent?.User?.contactNumber ?? undefined,

      fatherEmail:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "MALE",
        )[0]?.Parent?.User?.email ?? undefined,

      motherEmail:
        childDetails?.ParentChildren?.filter(
          (parent) => parent.Parent.gender === "FEMALE",
        )[0]?.Parent?.User?.email ?? undefined,

      childImage: childDetails?.image ?? undefined,
      childAttachments: childDetails?.attachments ?? undefined,
      childVaccines: childDetails?.vaccines ?? undefined,
    },
    // mode: "onChange", // validate onChange
    shouldUnregister: false, //keep dirty values after unmounting the form
  });

  const { mutate: upsertChildMutation, isLoading: isUpsertingChild } =
    api.child.upsertChild.useMutation({
      onSuccess: (data, formInputs) => {
        if (data) {
          ctx.child.getChild.setData(
            { childId: data.id },
            (prev) => data, //must be same data as getChild
          );

          if (setPageTitle) setPageTitle(data.nameEn);
        }
        // only when creating
        if (!formInputs.childId) {
          toast.success("Child added successfully");
          if (data) {
            router.replace(
              `${window.location.origin}/dashboard/children/update-child/${data.id}`,
            );
          }
        }
      },
    });

  function onSubmit(inputData: ChildFormInputsType) {
    // console.log({ inputData });
    upsertChildMutation({
      ...inputData,
      childId: childIdParam,
      fatherId: form.getValues("fatherId"),
      motherId: form.getValues("motherId"),
    });
  }

  const renderFormTab = (tab: TabsType) => {
    if (tab === "childInfo")
      return (
        <ChildInfoFormTab
          form={form}
          onSubmit={onSubmit}
          childIdParam={childIdParam}
        />
      );
    if (tab === "parentsInfo")
      return (
        <ParentInfoFormTab form={form} onSubmit={onSubmit} session={session} />
      );
    if (tab === "pickupList")
      return <PickupListFormTab form={form} onSubmit={onSubmit} />;

    // if (tab === "enrollProgram") return <h3>Enrollment Program</h3>;
    // if (tab === "summary") return <h3>Summary</h3>;
    // if (tab === "media") return <h3>Media</h3>;
    // if (tab === "dailyReports") return <h3>Daily Reports</h3>;
  };

  useEffect(() => {
    return () => {
      if (setPageTitle) setPageTitle(null);
    };
  }, [setPageTitle]);

  // show loading spinner only when creating to prevent multiple creating when doing many changes fast
  if (isUpsertingChild && !form.getValues("childId")) return <LoadingSpinner />;

  return (
    <Form {...form}>
      <form className="grid gap-2 px-4" id="child-form">
        <Tabs defaultValue="childInfo" className="w-full">
          <TabsList className="flex justify-start">
            {TABS.map(({ title, value }, idx) => (
              <TabsTrigger
                key={nanoid()}
                value={value}
                className={cn("", {
                  "ml-14": idx === 0,
                  "mr-14": idx === TABS.length - 1,
                })}
              >
                {title}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map(({ value }) => (
            <TabsContent key={value} value={value} className="p-4">
              {renderFormTab(value)}
            </TabsContent>
          ))}
        </Tabs>
      </form>
    </Form>
  );
};
