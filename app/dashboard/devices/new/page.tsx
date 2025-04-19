import AddDeviceForm from "@/components/AddDeviceForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

function NewDevicePage() {
  return (
    <div className="flex justify-center">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>New Device</CardTitle>
          <CardDescription>
            The device will be automatically connected to the grid. It might
            take few minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddDeviceForm device={null} />
        </CardContent>
      </Card>
    </div>
  );
}

export default NewDevicePage;
