import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

type DevicePageProps = {
  params: Promise<{ id: number }>;
};

type Alert = {
  id: number;
  message: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  created_at: string;
};

async function DevicePage({ params }: DevicePageProps) {
  const rtfm = new Intl.RelativeTimeFormat("gr-EL");

  const { id } = await params;
  const client = await createClient();
  const { data, error } = await client
    .from("Devices")
    .select("*, DeviceType (type), Alerts (id, message, severity, created_at)")
    .eq("id", id);

  if (error) return <p>Error: {error.message}</p>;

  if (!data || data.length === 0) return notFound();

  const device = {
    ...data[0],
  };

  return (
    <div>
      <CardHeader className="p-0 mb-10 flex md:flex-row md:justify-between">
        <div>
          <CardTitle>Device: {device.name}</CardTitle>
          <CardDescription>
            Created: {new Date(device.created_at).toLocaleDateString("el-GR")}
          </CardDescription>
        </div>
        <Button className="w-full md:w-auto" asChild>
          <Link
            href={`/dashboard/devices/${device.id}/edit`}
            className="flex items-center gap-4"
          >
            <Edit size={16} /> Edit
          </Link>
        </Button>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2">
        {/* <CardContent className="w-full"> */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-x-2 gap-y-4 md:content-start">
          <Label className="md:text-right">System ID</Label>
          <Input
            value={device.id}
            readOnly
            className="w-full focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Label className="md:text-right">Name</Label>
          <Input
            value={device.name}
            readOnly
            className="w-full ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Label className="md:text-right">Type</Label>
          <Input
            value={device.DeviceType.type}
            readOnly
            className="w-full ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Label className="md:text-right">SIM No</Label>
          <Input
            value={randomUUID()}
            readOnly
            className="w-full ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        {/* </CardContent> */}

        <div className="flex flex-col gap-4 self-start p-4 border border-emerald-500 rounded-md w-full">
          <div className="flex items-center gap-4 self-start p-4 border rounded-md w-full">
            <p className="font-bold text-md">Status</p>
            <p className="font-bold text-md text-emerald-500 animate-pulse duration-1000">
              Online
            </p>
          </div>
          <p className="text-muted-foreground text-sm">
            Last Heartbeat: {rtfm.format(-5, "minute")}
          </p>
        </div>
        {/* <Card className="border-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Status</CardTitle>
            <p className="text-emerald-500 animate-pulse">Online</p>
          </CardHeader>
        </Card> */}
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-indigo-500">
            <CardHeader>
              <CardTitle className="text-center">Today's Usage</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-4xl text-emerald-600">
              200L
            </CardContent>
          </Card>
          <Card className="border-indigo-500">
            <CardHeader>
              <CardTitle className="text-center">Greywater Recycled</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-4xl text-emerald-600">
              30L
            </CardContent>
          </Card>
          <Card className="border-indigo-500">
            <CardHeader>
              <CardTitle className="text-center">Monthly Savings</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-4xl text-indigo-400">
              €5.20
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-10">
        <Card className="w-full">
          <CardHeader className="flex md:flex-row md:items-center justify-between">
            <div>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>
                5 latest alerts from {device.name}
              </CardDescription>
            </div>
            <Button className="w-full md:w-auto" asChild>
              <Link href="/dashboard/alerts">See All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Alert ID</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {device.Alerts?.length === 0 && (
                  <TableRow>
                    <TableCell
                      className="font-medium"
                      align="center"
                      colSpan={5}
                    >
                      That's great! No alerts at the moment!
                    </TableCell>
                  </TableRow>
                )}
                {device.Alerts?.map((alert: Alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.id}</TableCell>
                    <TableCell>{alert.severity}</TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>
                      {new Date(alert.created_at).toLocaleString("el-GR", {
                        hour12: false,
                      })}
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Eye size={18} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DevicePage;
