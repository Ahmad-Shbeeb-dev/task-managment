/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import {
  IconCalendar,
  IconDownload,
  IconTrash,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import Compressor from "@uppy/compressor";
import Uppy from "@uppy/core";
import { DragDrop, StatusBar } from "@uppy/react";
import XHR from "@uppy/xhr-upload";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValues,
  useForm,
} from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import { api } from "~/utils/api";
import { cn } from "~/utils/ui";
import { handleThumbnailDownload } from "~/utils/utils";
import { DebouncedInput } from "~/components/DebouncedInput";
import { Button } from "~/components/ui/Button";
import { Calendar } from "~/components/ui/Calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { MultiSelect } from "~/components/ui/MultiSelect";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import type {
  ChildBloodType,
  ChildBloodTypeArray,
  ChildFormInputsType,
  GenderArray,
  GenderType,
  ImageCategory,
} from "~/types";

interface Props {
  form: ReturnType<typeof useForm<ChildFormInputsType>>;
  onSubmit: (data: ChildFormInputsType) => void;
  childIdParam?: string;
}

const GENDERS: GenderArray = ["MALE", "FEMALE"];
const BLOOD_TYPES: ChildBloodTypeArray = [
  "O_POSITIVE",
  "O_NEGATIVE",
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
];

export const ChildInfoFormTab = ({ form, onSubmit, childIdParam }: Props) => {
  const [selectedClasses, setSelectedClasses] = useState<
    { id: string; label: string | null }[]
  >([]);
  const [selectedLanguages, setSelectedLanguages] = useState<
    { id: string; label: string | null }[]
  >([]);
  const [dialogOpened, setDialogOpened] = useState(false);
  const [confirmData, setConfirmData] = useState("");
  const [confirmType, setConfirmType] = useState<
    "image" | "attachment" | "vaccine" | null
  >(null);
  const [lightBoxOpened, setLightBoxOpened] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([""]);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [vaccineImages, setVaccineImages] = useState<string[] | undefined>();
  const [attachmentImages, setAttachmentImages] = useState<
    string[] | undefined
  >();
  const [base64ChildImage, setBase64ChildImage] = useState<string | null>(
    form.getValues("childImage") ?? null,
  );
  const [base64ChildAttachments, setBase64ChildAttachments] = useState<
    string[] | null
  >(form.getValues("childAttachments") ?? null);
  const [base64ChildVaccines, setBase64ChildVaccines] = useState<
    string[] | null
  >(form.getValues("childVaccines") ?? null);

  const [uppyChildImage] = useState(() =>
    new Uppy({
      restrictions: {
        // allowedFileTypes: ["image/*", ".jpg", ".jpeg"],
        allowedFileTypes: [".jpg", ".jpeg", ".png", ".webp", ".bmp"],
        maxFileSize: 1000000, //1 mb
        maxNumberOfFiles: 1,
      },
      onBeforeUpload(files) {
        // Change all file names:
        // We’ll be careful to return a new object, not mutating the original `files`
        const updatedFiles = {};

        Object.keys(files).forEach((fileID) => {
          const newFileName = `child_image_${format(
            new Date(),
            "dd_MM_yyyy_hh_mm_ss_a",
          )}_${nanoid(6)}.${files[fileID]?.extension}`;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          updatedFiles[fileID] = {
            ...files[fileID],
            name: newFileName,
            meta: {
              ...files[fileID]?.meta,
              name: newFileName,
              category: "childImage" as ImageCategory,
            },
          };
        });
        return updatedFiles;
      },
    })
      .use(Compressor)
      .use(XHR, {
        endpoint: "/api/upload",
        formData: true,
        getResponseData(responseText, response) {
          const parsedRespnse = JSON.parse(responseText) as {
            savePath?: string;
            base64FileStr?: string;
          };
          const savePath = parsedRespnse.savePath;
          const base64FileStr = parsedRespnse.base64FileStr;
          if (savePath && base64FileStr) {
            setBase64ChildImage(base64FileStr);
            form.setValue("childImage", savePath);
            uppyChildImage.cancelAll();
            void form.handleSubmit(onSubmit)();
          }
          return {
            response,
          };
        },
        getResponseError(responseText, xhr) {
          const parsedRespnse = JSON.parse(responseText) as {
            error?: string;
          };
          return new Error(parsedRespnse?.error);
        },
      }),
  );

  uppyChildImage.on("file-added", () => {
    void uppyChildImage.upload();
  });

  // server error
  uppyChildImage.on("upload-error", (file, error) => {
    toast.error(error.message);
  });

  // client error
  uppyChildImage.on("info-visible", () => {
    const { info: infos } = uppyChildImage.getState();
    if (infos && infos.length > 0) {
      infos.forEach((info) => {
        if (info.type === "error") {
          toast.error(info.message);
        }
      });
    }
  });

  const [uppyChildAttachments] = useState(() =>
    new Uppy({
      restrictions: {
        // allowedFileTypes: ["image/*", ".jpg", ".jpeg"],
        allowedFileTypes: [".jpg", ".jpeg", ".png", ".webp", ".bmp", ".pdf"],
        maxFileSize: 1000000, //1 mb
        // maxNumberOfFiles: 1,
      },
      onBeforeUpload(files) {
        // Change all file names:
        // We’ll be careful to return a new object, not mutating the original `files`
        const updatedFiles = {};

        Object.keys(files).forEach((fileID) => {
          const newFileName = `child_attachment_${format(
            new Date(),
            "dd_MM_yyyy_hh_mm_ss_a",
          )}_${nanoid(6)}.${files[fileID]?.extension}`;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          updatedFiles[fileID] = {
            ...files[fileID],
            name: newFileName,
            meta: {
              ...files[fileID]?.meta,
              name: newFileName,
              category: "childAttachment" as ImageCategory,
            },
          };
        });

        return updatedFiles;
      },
    })
      .use(Compressor)
      .use(XHR, {
        endpoint: "/api/upload",
        formData: true,
        getResponseData(responseText, response) {
          const parsedRespnse = JSON.parse(responseText) as {
            savePath?: string;
            base64FileStr?: string;
          };
          const savePath = parsedRespnse.savePath;
          const base64FileStr = parsedRespnse.base64FileStr;
          if (savePath && base64FileStr) {
            setBase64ChildAttachments((prev) =>
              prev ? [...prev, base64FileStr] : [base64FileStr],
            );
            setAttachmentImages((prev) =>
              prev ? [...prev, savePath] : [savePath],
            );
          }
          return {
            response,
          };
        },
        getResponseError(responseText, xhr) {
          const parsedRespnse = JSON.parse(responseText) as {
            error?: string;
          };
          return new Error(parsedRespnse?.error);
        },
      }),
  );

  uppyChildAttachments.on("files-added", () => {
    void uppyChildAttachments.upload();
  });

  // server error
  uppyChildAttachments.on("upload-error", (file, error) => {
    toast.error(error.message);
  });

  // client error
  uppyChildAttachments.on("info-visible", () => {
    const { info: infos } = uppyChildAttachments.getState();
    if (infos && infos.length > 0) {
      infos.forEach((info) => {
        if (info.type === "error") {
          toast.error(info.message);
        }
      });
    }
  });

  const [uppyChildVaccines] = useState(() =>
    new Uppy({
      restrictions: {
        // allowedFileTypes: ["image/*", ".jpg", ".jpeg"],
        allowedFileTypes: [".jpg", ".jpeg", ".png", ".webp", ".bmp", ".pdf"],
        maxFileSize: 1000000, //1 mb
        // maxNumberOfFiles: 1,
      },
      onBeforeUpload(files) {
        // Change all file names:
        // We’ll be careful to return a new object, not mutating the original `files`
        const updatedFiles = {};

        Object.keys(files).forEach((fileID) => {
          const newFileName = `child_vaccine_${format(
            new Date(),
            "dd_MM_yyyy_hh_mm_ss_a",
          )}_${nanoid(6)}.${files[fileID]?.extension}`;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          updatedFiles[fileID] = {
            ...files[fileID],
            name: newFileName,
            meta: {
              ...files[fileID]?.meta,
              name: newFileName,
              category: "childVaccine" as ImageCategory,
            },
          };
        });

        return updatedFiles;
      },
    })
      .use(Compressor)
      .use(XHR, {
        endpoint: "/api/upload",
        formData: true,
        getResponseData(responseText, response) {
          const parsedRespnse = JSON.parse(responseText) as {
            savePath?: string;
            base64FileStr?: string;
          };
          const savePath = parsedRespnse.savePath;
          const base64FileStr = parsedRespnse.base64FileStr;
          if (savePath && base64FileStr) {
            setBase64ChildVaccines((prev) =>
              prev ? [...prev, base64FileStr] : [base64FileStr],
            );
            setVaccineImages((prev) =>
              prev ? [...prev, savePath] : [savePath],
            );
          }
          return {
            response,
          };
        },
        getResponseError(responseText, xhr) {
          const parsedRespnse = JSON.parse(responseText) as {
            error?: string;
          };
          return new Error(parsedRespnse?.error);
        },
      }),
  );

  uppyChildVaccines.on("files-added", () => {
    void uppyChildVaccines.upload();
  });

  // server error
  uppyChildVaccines.on("upload-error", (file, error) => {
    toast.error(error.message);
  });

  // client error
  uppyChildVaccines.on("info-visible", () => {
    const { info: infos } = uppyChildVaccines.getState();
    if (infos && infos.length > 0) {
      infos.forEach((info) => {
        if (info.type === "error") {
          toast.error(info.message);
        }
      });
    }
  });

  useEffect(() => {
    const totalAttachmentFiles = uppyChildAttachments.getFiles().length;
    const uploadedAttachmentImages = attachmentImages?.length;
    if (totalAttachmentFiles === uploadedAttachmentImages) {
      form.setValue("childAttachments", attachmentImages);
      uppyChildAttachments.cancelAll();
      setAttachmentImages(undefined);
      void form.handleSubmit(onSubmit)();
    }
  }, [attachmentImages, uppyChildAttachments]);

  useEffect(() => {
    const totalVaccineFiles = uppyChildVaccines.getFiles().length;
    const uploadedVaccineImages = vaccineImages?.length;
    if (totalVaccineFiles === uploadedVaccineImages) {
      form.setValue("childVaccines", vaccineImages);
      uppyChildVaccines.cancelAll();
      setVaccineImages(undefined);
      void form.handleSubmit(onSubmit)();
    }
  }, [vaccineImages, uppyChildVaccines]);

  const { data: allClasses } = api.class.getClasses.useQuery(undefined, {
    refetchOnMount: true,
    onSuccess(classes) {
      if (classes && childIdParam) {
        const childClasses = form.getValues("childClasses");
        if (childClasses && childClasses.length > 0) {
          setSelectedClasses(
            classes
              .filter((classs) => childClasses.includes(classs.id))
              .map((classs) => ({
                id: classs.id,
                label: classs.className,
              })),
          );
        }
      }
    },
  });

  const { data: allLanguages } = api.child.getLanguages.useQuery(undefined, {
    refetchOnMount: true,
    onSuccess(languages) {
      if (languages && childIdParam) {
        const childLanguages = form.getValues("childLanguages");
        if (childLanguages && childLanguages.length > 0) {
          setSelectedLanguages(
            languages
              .filter((language) => childLanguages.includes(language.id))
              .map((language) => ({
                id: language.id,
                label: language.name,
              })),
          );
        }
      }
    },
  });

  const { mutate: deleteChildClassMutation } =
    api.child.deleteChildClass.useMutation();

  const { mutate: deleteChildLanguageMutation } =
    api.child.deleteChildLanguage.useMutation();

  const { mutate: deleteChildEmergencyMutation } =
    api.child.deleteChildEmergency.useMutation();

  const { mutate: deleteChildSibilingMutation } =
    api.child.deleteChildSibiling.useMutation();

  const { mutate: deleteChildAttachmentMutation } =
    api.child.deleteChildAttachment.useMutation({
      onSuccess(data) {
        if (data) {
          setBase64ChildAttachments(data.attachments);
        }
      },
    });

  const { mutate: deleteChildVaccineMutation } =
    api.child.deleteChildVaccine.useMutation({
      onSuccess(data) {
        if (data) {
          setBase64ChildVaccines(data.vaccines);
        }
      },
    });

  const { mutate: deleteChildImageMutation } =
    api.child.deleteChildImage.useMutation({
      onSuccess(data) {
        if (data) {
          setBase64ChildImage(null);
        }
      },
    });

  const [changedArrayField, setChangedArrayField] = useState("");

  const handleOnChange = <
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
  >(
    field: ControllerRenderProps<TFieldValues, TName>,
    value: FieldPathValue<TFieldValues, TName>,
  ) => {
    if (field.name.includes("childEmergencies" as keyof ChildFormInputsType)) {
      setChangedArrayField(field.name);
    }
    if (field.name.includes("childSibilings" as keyof ChildFormInputsType)) {
      setChangedArrayField(field.name);
    }
    field.onChange(value);
    void form.handleSubmit(onSubmit)();
  };

  const handleDeleteAttachment = (base64Attachment: string) => {
    const childId = form.getValues("childId");
    if (childId) {
      deleteChildAttachmentMutation({ childId, base64Attachment });
      setDialogOpened(false);
    }
  };

  const handleDeleteVaccine = (base64Vaccine: string) => {
    const childId = form.getValues("childId");
    if (childId) {
      deleteChildVaccineMutation({ childId, base64Vaccine });
      setDialogOpened(false);
    }
  };

  const handleDeleteImage = () => {
    const childId = form.getValues("childId");
    if (childId) {
      deleteChildImageMutation({ childId });
      setDialogOpened(false);
    }
  };

  const handleConfirmDialog = () => {
    if (confirmType === "attachment") {
      handleDeleteAttachment(confirmData);
    }
    if (confirmType === "vaccine") {
      handleDeleteVaccine(confirmData);
    }
    if (confirmType === "image") {
      handleDeleteImage();
    }
  };

  // fixes unfocus of fieldArray after setting the upserted data values
  useEffect(() => {
    if (changedArrayField) {
      form.setFocus(changedArrayField as keyof ChildFormInputsType);
    }
  }, [
    changedArrayField,
    form,
    form.watch("childEmergencies"),
    form.watch("childSibilings"),
  ]);

  const childEmergencyFields = useFieldArray({
    control: form.control,
    name: "childEmergencies",
    keyName: "autoGenKey",
  });

  const childSibilingFields = useFieldArray({
    control: form.control,
    name: "childSibilings",
    keyName: "autoGenKey",
  });

  const handleAddEmergencyField = () => {
    childEmergencyFields.append({
      emergencyId: undefined,
      emergencyName: "",
      contactNumber: "",
      relationToChild: "",
    });
  };

  const handleAddSibilingField = () => {
    childSibilingFields.append({
      id: undefined,
      name: "",
      age: null,
      gender: null,
      school: "",
    });
  };

  const handleRemoveEmergencyField = (index: number) => {
    const childEmergency = form.getValues("childEmergencies")?.[index];
    childEmergencyFields.remove(index);

    if (
      childEmergency?.emergencyName !== "" ||
      childEmergency?.contactNumber !== "" ||
      childEmergency?.relationToChild !== ""
    ) {
      if (childEmergency?.emergencyId) {
        deleteChildEmergencyMutation({
          emergencyId: childEmergency.emergencyId,
        });
      }
    }
  };

  const handleRemoveSibilingField = (index: number) => {
    const childSibiling = form.getValues("childSibilings")?.[index];
    childSibilingFields.remove(index);

    if (
      childSibiling?.name !== "" ||
      childSibiling?.age !== null ||
      childSibiling?.school !== "" ||
      childSibiling?.gender !== null
    ) {
      if (childSibiling?.id) {
        deleteChildSibilingMutation({
          sibilingId: childSibiling.id,
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Child Details */}
      <p className="bg-[#FAFAFA] py-2 text-lg font-semibold">Child Details</p>
      <div className="grid grid-cols-3 gap-3">
        {/* Name en */}
        <FormField
          control={form.control}
          name="childNameEn"
          render={({ field }) => (
            <FormItem className="col-span-3 xl:col-span-1">
              <FormLabel>Name (en)</FormLabel>
              <FormControl>
                <DebouncedInput
                  {...field}
                  debounce={500}
                  value={field.value}
                  onChange={(value) => handleOnChange(field, value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Name ar */}
        <FormField
          control={form.control}
          name="childNameAr"
          render={({ field }) => (
            <FormItem className="col-span-3 xl:col-span-1">
              <FormLabel>Name (ar)</FormLabel>
              <FormControl>
                <DebouncedInput
                  {...field}
                  debounce={500}
                  value={field.value}
                  onChange={(value) => handleOnChange(field, value)}
                  lang="ar"
                  dir="rtl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Date of Birth */}
        <FormField
          control={form.control}
          name="childDateOfBirth"
          render={({ field }) => (
            <FormItem className="col-span-3 mt-1.5 flex flex-col gap-0.5 xl:col-span-1">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(value) => handleOnChange(field, value)}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {/* <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Father Name */}
        <FormField
          control={form.control}
          name="childFatherName"
          render={({ field }) => (
            <FormItem className="col-span-3 xl:col-span-1">
              <FormLabel>Father Name</FormLabel>
              <FormControl>
                <DebouncedInput
                  {...field}
                  debounce={500}
                  value={field.value}
                  onChange={(value) => handleOnChange(field, value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mother Name */}
        <FormField
          control={form.control}
          name="childMotherName"
          render={({ field }) => (
            <FormItem className="col-span-3 xl:col-span-1">
              <FormLabel>Mother Name</FormLabel>
              <FormControl>
                <DebouncedInput
                  {...field}
                  debounce={500}
                  value={field.value}
                  onChange={(value) => handleOnChange(field, value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nationality */}
        <FormField
          control={form.control}
          name="childNationality"
          render={({ field }) => (
            <FormItem className="col-span-3 xl:col-span-1">
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <DebouncedInput
                  {...field}
                  debounce={500}
                  value={field.value}
                  onChange={(value) => handleOnChange(field, value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="childGender"
          render={({ field }) => (
            <FormItem className="col-span-3  xl:col-span-1">
              <FormLabel>Gender</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) =>
                  handleOnChange(field, value as GenderType)
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GENDERS.map((gender, idx) => {
                    return (
                      <SelectItem key={idx} value={gender}>
                        {gender.toLowerCase()}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Home Address*/}
        <FormField
          control={form.control}
          name="childHomeAddress"
          render={({ field }) => (
            <FormItem className="col-span-3 xl:col-span-1">
              <FormLabel>Home Address</FormLabel>
              <FormControl>
                <DebouncedInput
                  {...field}
                  debounce={500}
                  value={field.value}
                  onChange={(value) => handleOnChange(field, value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Home Number*/}
        <FormField
          control={form.control}
          name="childHomeNumber"
          render={({ field }) => (
            <FormItem className="col-span-3 xl:col-span-1">
              <FormLabel>Home Number</FormLabel>
              <FormControl>
                <DebouncedInput
                  {...field}
                  debounce={500}
                  value={field.value}
                  onChange={(value) => handleOnChange(field, value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Start Date */}
        <FormField
          control={form.control}
          name="childStartDate"
          render={({ field }) => (
            <FormItem className="col-span-3 mt-1.5 flex flex-col gap-0.5 xl:col-span-1">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(value) => handleOnChange(field, value)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Languages */}
        <FormField
          control={form.control}
          name="childLanguages"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Languages</FormLabel>
              <FormControl>
                <MultiSelect
                  items={
                    allLanguages?.map((language) => ({
                      id: language.id,
                      label: language.name,
                    })) ?? []
                  }
                  selected={selectedLanguages}
                  setSelected={setSelectedLanguages}
                  onSelect={(item) => {
                    setSelectedLanguages((prev) => [...prev, item]);

                    handleOnChange(field, [
                      ...selectedLanguages.map((language) => language.id),
                      item.id,
                    ]);
                  }}
                  onUnselect={(item) => {
                    if (childIdParam) {
                      deleteChildLanguageMutation({
                        childId: childIdParam,
                        languageId: item.id,
                      });

                      setSelectedLanguages((prev) =>
                        prev.filter((language) => language.id !== item.id),
                      );

                      handleOnChange(
                        field,
                        selectedLanguages
                          .map((language) => language.id)
                          .filter((language) => language !== item.id),
                      );
                    }
                  }}
                  placeHolder="Select Language..."
                  // className="w-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Classes */}
        <FormField
          control={form.control}
          name="childClasses"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Classes</FormLabel>
              <FormControl>
                <MultiSelect
                  items={
                    allClasses?.map((classs) => ({
                      id: classs.id,
                      label: classs.className,
                    })) ?? []
                  }
                  selected={selectedClasses}
                  setSelected={setSelectedClasses}
                  onSelect={(item) => {
                    setSelectedClasses((prev) => [...prev, item]);

                    handleOnChange(field, [
                      ...selectedClasses.map((classs) => classs.id),
                      item.id,
                    ]);
                  }}
                  onUnselect={(item) => {
                    if (childIdParam) {
                      deleteChildClassMutation({
                        childId: childIdParam,
                        classId: item.id,
                      });

                      setSelectedClasses((prev) =>
                        prev.filter((classs) => classs.id !== item.id),
                      );

                      handleOnChange(
                        field,
                        selectedClasses
                          .map((classs) => classs.id)
                          .filter((classs) => classs !== item.id),
                      );
                    }
                  }}
                  placeHolder="Select Class..."
                  // className="w-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Child Image */}
      <div className="flex items-center justify-around gap-4">
        <div className="grid grid-cols-3 place-items-center gap-2">
          {base64ChildImage ? (
            <div className="relative">
              <img
                className="h-[160px] w-[180px] rounded"
                src={base64ChildImage}
                alt="child"
                onClick={() => {
                  setLightboxImages([base64ChildImage]);
                  setLightboxImageIndex(0);
                  setLightBoxOpened(true);
                }}
              />
              <Button
                size="icon"
                className="absolute left-0 top-0 m-0 h-4 w-4 rounded bg-white p-0 text-red-600/95 hover:bg-white/60 hover:text-red-700/60"
                type="button"
                onClick={() => {
                  setDialogOpened(true);
                  setConfirmType("image");
                }}
              >
                <IconX />
              </Button>
              <Button
                size="icon"
                className="absolute right-0 top-0 m-0 h-4 w-4 rounded bg-white p-0 text-blue-600/95 hover:bg-white/60 hover:text-blue-700/60"
                type="button"
                onClick={() => {
                  handleThumbnailDownload(base64ChildImage);
                }}
              >
                <IconDownload />
              </Button>
            </div>
          ) : (
            <IconUser className="h-[160px] w-[180px] rounded bg-slate-100" />
          )}
        </div>
        {/* <Dashboard
          // tw=""
          uppy={uppyChildImage}
          proudlyDisplayPoweredByUppy={false}
          plugins={["ImageEditor"]}
          showProgressDetails
          note="Images only, up to 1 MB"
          fileManagerSelectionType="files"
          height="250px"
          width="320px"
        /> */}
        <div className="flex flex-col gap-2">
          <DragDrop
            uppy={uppyChildImage}
            note="Images only, up to 1 MB"
            height="160px"
            width="180px"
          />
          <StatusBar uppy={uppyChildImage} />
        </div>
      </div>

      {/* Attachments */}
      <p className="bg-[#FAFAFA] py-2 text-lg font-semibold">Attachments</p>
      <div className="flex items-center justify-around gap-4">
        {base64ChildAttachments && base64ChildAttachments.length > 0 && (
          <div className="grid grid-cols-3 place-items-center gap-2">
            {base64ChildAttachments.map((childAttachment, index) => (
              <div className="relative" key={nanoid()}>
                {childAttachment.includes("data:application/pdf") ? (
                  <embed
                    className="h-[160px] w-[180px] rounded"
                    src={childAttachment}
                  />
                ) : (
                  <img
                    className="h-[160px] w-[180px] rounded"
                    src={childAttachment}
                    alt="attachment"
                    onClick={() => {
                      // const childAttachmentsImages =
                      //   base64ChildAttachments.filter(
                      //     (attachment) =>
                      //       !attachment.includes("data:application/pdf"),
                      //   );
                      setLightboxImages(base64ChildAttachments);
                      setLightboxImageIndex(index);
                      setLightBoxOpened(true);
                    }}
                  />
                )}

                <Button
                  size="icon"
                  className="absolute left-0 top-0 m-0 h-4 w-4 rounded bg-white p-0 text-red-600/95 hover:bg-white/60 hover:text-red-700/60"
                  type="button"
                  onClick={() => {
                    setDialogOpened(true);
                    setConfirmType("attachment");
                    setConfirmData(childAttachment);
                  }}
                >
                  <IconX />
                </Button>
                <Button
                  size="icon"
                  className="absolute right-0 top-0 m-0 h-4 w-4 rounded bg-white p-0 text-blue-600/95 hover:bg-white/60 hover:text-blue-700/60"
                  type="button"
                  onClick={() => {
                    handleThumbnailDownload(childAttachment);
                  }}
                >
                  <IconDownload />
                </Button>
              </div>
            ))}
          </div>
        )}
        {/* <Dashboard
          // tw=""
          uppy={uppyChildAttachments}
          proudlyDisplayPoweredByUppy={false}
          plugins={["ImageEditor"]}
          showProgressDetails
          note="Images only, up to 1 MB"
          fileManagerSelectionType="files"
          height="250px"
          width="320px"
        /> */}
        <div className="flex flex-col gap-2">
          <DragDrop
            uppy={uppyChildAttachments}
            note="Images & PDFs only, up to 1 MB"
            height="160px"
            width="180px"
          />
          <StatusBar uppy={uppyChildAttachments} />
        </div>
      </div>

      {/* Vaccines */}
      <p className="bg-[#FAFAFA] py-2 text-lg font-semibold">Vaccines</p>
      <div className="flex items-center justify-around gap-4">
        {base64ChildVaccines && base64ChildVaccines.length > 0 && (
          <div className="grid grid-cols-3 place-items-center gap-2">
            {base64ChildVaccines.map((childVaccine, index) => (
              <div className="relative" key={nanoid()}>
                {childVaccine.includes("data:application/pdf") ? (
                  <embed
                    className="h-[160px] w-[180px] rounded"
                    src={childVaccine}
                  />
                ) : (
                  <img
                    className="h-[160px] w-[180px] rounded"
                    src={childVaccine}
                    alt="vaccine"
                    onClick={() => {
                      setLightboxImages(base64ChildVaccines);
                      setLightboxImageIndex(index);
                      setLightBoxOpened(true);
                    }}
                  />
                )}
                <Button
                  size="icon"
                  className="absolute left-0 top-0 m-0 h-4 w-4 rounded bg-white p-0 text-red-600/95 hover:bg-white/60 hover:text-red-700/60"
                  type="button"
                  onClick={() => {
                    setDialogOpened(true);
                    setConfirmType("vaccine");
                    setConfirmData(childVaccine);
                  }}
                >
                  <IconX />
                </Button>
                <Button
                  size="icon"
                  className="absolute right-0 top-0 m-0 h-4 w-4 rounded bg-white p-0 text-blue-600/95 hover:bg-white/60 hover:text-blue-700/60"
                  type="button"
                  onClick={() => {
                    handleThumbnailDownload(childVaccine);
                  }}
                >
                  <IconDownload />
                </Button>
              </div>
            ))}
          </div>
        )}
        {/* <Dashboard
          // tw=""
          uppy={uppyChildVaccines}
          proudlyDisplayPoweredByUppy={false}
          plugins={["ImageEditor"]}
          showProgressDetails
          note="Images only, up to 1 MB"
          fileManagerSelectionType="files"
          height="250px"
          width="320px"
        /> */}
        <div className="flex flex-col gap-2">
          <DragDrop
            uppy={uppyChildVaccines}
            note="Images & PDFs only, up to 1 MB"
            height="160px"
            width="180px"
          />
          <StatusBar uppy={uppyChildVaccines} />
        </div>
      </div>

      {/* Medical Information */}
      <p className="bg-[#FAFAFA] py-2 text-lg font-semibold">
        Medical Information
      </p>
      <div className="grid grid-cols-3 gap-3">
        {/* Surgery */}
        <FormField
          control={form.control}
          name="childSurgery"
          render={({ field }) => (
            <FormItem className="col-span-3 xl:col-span-1">
              <FormLabel>Surgery</FormLabel>
              <FormControl>
                <DebouncedInput
                  {...field}
                  debounce={500}
                  value={field.value}
                  onChange={(value) => handleOnChange(field, value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Allergy */}
        <FormField
          control={form.control}
          name="childAllergy"
          render={({ field }) => (
            <FormItem className="col-span-3 xl:col-span-1">
              <FormLabel>Allergy</FormLabel>
              <FormControl>
                <DebouncedInput
                  {...field}
                  debounce={500}
                  value={field.value}
                  onChange={(value) => handleOnChange(field, value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Blood Type */}
        <FormField
          control={form.control}
          name="childBloodType"
          render={({ field }) => (
            <FormItem className="col-span-3  xl:col-span-1">
              <FormLabel>Blood Type</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) =>
                  handleOnChange(field, value as ChildBloodType)
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BLOOD_TYPES.map((gender, idx) => {
                    return (
                      <SelectItem key={idx} value={gender}>
                        {gender.toLowerCase()}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Medication */}
        <FormField
          control={form.control}
          name="childMedication"
          render={({ field }) => (
            <FormItem className="col-span-3 xl:col-span-1">
              <FormLabel>Medication</FormLabel>
              <FormControl>
                <DebouncedInput
                  {...field}
                  debounce={500}
                  value={field.value}
                  onChange={(value) => handleOnChange(field, value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Disease */}
        <FormField
          control={form.control}
          name="childDisease"
          render={({ field }) => (
            <FormItem className="col-span-3 xl:col-span-1">
              <FormLabel>Disease</FormLabel>
              <FormControl>
                <DebouncedInput
                  {...field}
                  debounce={500}
                  value={field.value}
                  onChange={(value) => handleOnChange(field, value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Child Emergency Contact */}
      <p className="bg-[#FAFAFA] py-2 text-lg font-semibold">
        Child Emergency Contact
      </p>

      {/* childEmergencies */}
      <div className="grid grid-cols-3 gap-4">
        {childEmergencyFields.fields.map((field, index) => (
          <Fragment key={field.autoGenKey}>
            {/* Name */}
            <FormField
              control={form.control}
              name={`childEmergencies.${index}.emergencyName` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      {...field}
                      inputType="input"
                      debounce={500}
                      value={field.value}
                      onChange={(value) => handleOnChange(field, value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Relation To Child */}
            <FormField
              control={form.control}
              name={`childEmergencies.${index}.relationToChild` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relation To Child</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      {...field}
                      inputType="input"
                      debounce={500}
                      value={field.value}
                      onChange={(value) => handleOnChange(field, value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Number */}
            <div className="flex">
              <FormField
                control={form.control}
                name={`childEmergencies.${index}.contactNumber` as const}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <DebouncedInput
                        {...field}
                        inputType="input"
                        debounce={500}
                        value={field.value}
                        onChange={(value) => handleOnChange(field, value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <IconTrash
                onClick={() => handleRemoveEmergencyField(index)}
                className="mx-3 mt-9 h-6 w-8 cursor-pointer text-red-500"
              />
            </div>
          </Fragment>
        ))}
      </div>
      <Button
        type="button"
        size="sm"
        className="w-fit place-self-center bg-[#95D354] px-12 hover:bg-[#84b84c]"
        onClick={handleAddEmergencyField}
      >
        Add More+
      </Button>

      {/* Child Sibilings */}
      <p className="bg-[#FAFAFA] py-2 text-lg font-semibold">Child Sibilings</p>
      {/* childSibilings */}
      <div className="grid grid-cols-4 gap-4">
        {childSibilingFields.fields.map((field, index) => (
          <Fragment key={field.autoGenKey}>
            {/* Name */}
            <FormField
              control={form.control}
              name={`childSibilings.${index}.name` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      {...field}
                      inputType="input"
                      debounce={500}
                      value={field.value}
                      onChange={(value) => handleOnChange(field, value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age */}
            <FormField
              control={form.control}
              name={`childSibilings.${index}.age` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      {...field}
                      inputType="input"
                      type="number"
                      debounce={500}
                      value={String(field.value)}
                      onChange={(value) =>
                        handleOnChange(field, parseInt(value ?? ""))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* School */}
            <FormField
              control={form.control}
              name={`childSibilings.${index}.school` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      {...field}
                      inputType="input"
                      debounce={500}
                      value={field.value}
                      onChange={(value) => handleOnChange(field, value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <div className="flex">
              <FormField
                control={form.control}
                name={`childSibilings.${index}.gender` as const}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      value={field.value as string}
                      onValueChange={(value) =>
                        handleOnChange(field, value as GenderType)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GENDERS.map((gender, idx) => {
                          return (
                            <SelectItem key={idx} value={gender}>
                              {gender.toLowerCase()}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <IconTrash
                onClick={() => handleRemoveSibilingField(index)}
                className="mx-3 mt-9 h-6 w-8 cursor-pointer text-red-500"
              />
            </div>
          </Fragment>
        ))}
      </div>
      <Button
        type="button"
        size="sm"
        className="w-fit place-self-center bg-[#95D354] px-12 hover:bg-[#84b84c]"
        onClick={handleAddSibilingField}
      >
        Add More+
      </Button>

      {/* Notes */}
      <p className="bg-[#FAFAFA] py-2 text-lg font-semibold">Notes</p>
      <div className="grid grid-cols-3">
        {/* Note */}
        <FormField
          control={form.control}
          name="childNote"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <DebouncedInput
                  {...field}
                  inputType="textarea"
                  debounce={500}
                  value={field.value}
                  onChange={(value) => handleOnChange(field, value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Lightbox
        open={lightBoxOpened}
        plugins={[Zoom, Thumbnails, Counter]}
        close={() => setLightBoxOpened(false)}
        slides={lightboxImages.map((img) => ({
          src: img,
          type: "image",
          // height: 300,
          // width: 300,
        }))}
        thumbnails={{
          position: "bottom",
          imageFit: "cover",
          // gap: 5,
          vignette: false,
        }}
        index={lightboxImageIndex}
      />

      <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                handleConfirmDialog();
              }}
              className="hover:bg-red-400"
              type="button"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
