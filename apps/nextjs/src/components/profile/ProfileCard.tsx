"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCheck, IconEdit } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { updateUserValidation } from "@acme/api/validations";

import { api } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";
import { Skeleton } from "~/components/ui/Skeleton";

const ProfileCardSkeleton = () => {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile</CardTitle>
        <Skeleton className="h-9 w-9" />
      </CardHeader>
      <CardContent>
        <div className="mb-8 flex flex-col items-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-8 w-32" />
            <Skeleton className="mx-auto h-5 w-24" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProfileCard = () => {
  const [isEdit, setIsEdit] = useState(false);
  const utils = api.useUtils();
  const { data: userProfile, isLoading } = api.user.getUserProfile.useQuery();

  const form = useForm({
    resolver: zodResolver(updateUserValidation),
    values: {
      email: userProfile?.email ?? "",
      name: userProfile?.name ?? "",
    },
  });

  const { mutate: updateUser } = api.user.updateUser.useMutation({
    onSuccess: () => {
      void utils.user.getUserProfile.invalidate();
      setIsEdit(false);
    },
  });

  const onSubmit = (data: z.infer<typeof updateUserValidation>) => {
    updateUser(data);
  };

  if (isLoading) return <ProfileCardSkeleton />;
  if (!userProfile) return null;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (isEdit) {
              void form.handleSubmit(onSubmit)();
            } else {
              setIsEdit(true);
            }
          }}
        >
          {isEdit ? (
            <IconCheck className="h-5 w-5" />
          ) : (
            <IconEdit className="h-5 w-5" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-8 flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={undefined} alt={userProfile.name ?? "User"} />
            <AvatarFallback>
              {userProfile.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
            <p className="text-muted-foreground capitalize">
              Role: {userProfile.role.toLowerCase()}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEdit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEdit} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
