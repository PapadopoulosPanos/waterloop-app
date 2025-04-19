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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Bar, BarChart } from "recharts";

import { createClient } from "@/utils/supabase/server";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";

// import {
//   ChartContainer,
//   ChartTooltipContent,
//   ChartTooltip,
// } from "@/components/ui/chart";
// import { type ChartConfig } from "@/components/ui/chart";

async function Dashboard() {
  const client = await createClient();
  const { error, data: alerts } = await client
    .from("Alerts")
    .select(`*, Devices (name)`)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="flex flex-col gap-y-20 items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-y-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Today's Usage</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-4xl text-emerald-600">
            200L
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Greywater Recycled</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-4xl text-emerald-600">
            30L
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Monthly Savings</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-4xl text-indigo-400">
            €5.20
          </CardContent>
        </Card>
      </div>
      {/* <div>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <Bar dataKey="value" />
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
      </div> */}
      <Card className="w-full">
        <CardHeader className="flex md:flex-row md:items-center justify-between">
          <div>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>5 latest alerts from the grid</CardDescription>
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
                <TableHead>Device Name</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts?.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.id}</TableCell>
                  <TableCell className="font-medium">
                    <Link
                      className="text-indigo-500 hover:text-indigo-700 transition ease-in-out"
                      href={`/dashboard/devices/${alert.device_id}`}
                    >
                      {alert.Devices.name}
                    </Link>
                  </TableCell>
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
  );
}

export default Dashboard;
