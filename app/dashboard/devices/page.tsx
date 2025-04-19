import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";
import { Edit } from "lucide-react";
import Link from "next/link";
import React from "react";
import { MessageCircleWarning } from "lucide-react";

async function DevicesPage() {
  const client = await createClient();

  const { error, data: devices } = await client
    .from("Devices")
    .select(`*, DeviceType (id, type)`)
    .order("id");

  return (
    <>
      {error && (
        <div className="w-full mb-10">
          <div className="bg-destructive text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <MessageCircleWarning size="28" strokeWidth={2} />
            We are facing some issues with Waterloop availability. We are
            working to resolve the issues as soon as possible. Thank you for
            your patience!
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Devices</CardTitle>
              <CardDescription>Manage your devices</CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/devices/new">Add Device</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table className="w-full">
              <TableCaption>A list of your devices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Device ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices?.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.id}</TableCell>
                    <TableCell className="font-medium">
                      <Link
                        className="text-indigo-500 hover:text-indigo-700 transition ease-in-out"
                        href={`/dashboard/devices/${device.id}`}
                      >
                        {device.name}
                      </Link>
                    </TableCell>
                    <TableCell>{device.DeviceType.type}</TableCell>
                    <TableCell>
                      {new Date(device.created_at).toLocaleString("el-GR", {
                        hour12: false,
                      })}
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Link href={`/dashboard/devices/${device.id}/edit`}>
                        <Edit size={18} />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default DevicesPage;
