import AddDeviceForm from "@/components/AddDeviceForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

type EditDevicePageProps = {
  params: Promise<{ id: number }>;
};

async function EditDevicePage({ params }: EditDevicePageProps) {
  const { id } = await params;
  const client = await createClient();
  const { error, data } = await client
    .from("Devices")
    .select("id, name, typeId")
    .eq("id", id);

  console.log(data, error);

  if (!data || data.length === 0) return notFound();

  const device = {
    ...data[0],
  };

  return (
    <div className="flex justify-center">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Edit {device.name}</CardTitle>
          <CardDescription>
            It might take few minutes to propagate the changes to grid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddDeviceForm device={device} isUpdate />
        </CardContent>
      </Card>
    </div>
  );
}

export default EditDevicePage;
