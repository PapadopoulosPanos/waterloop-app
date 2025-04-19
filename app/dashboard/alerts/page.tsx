import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/server";
import { Eye, LinkIcon } from "lucide-react";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AlertsFilter, { Device } from "@/components/AlertsFilter";

type AlertsPageProps = {
  searchParams: Promise<{
    page: string | undefined;
    deviceId: string | undefined;
    severity: string | undefined;
    alertId: string | undefined;
  }>;
};

const PAGE_SIZE = 10;

function createQueryParams(
  page: number,
  deviceId: string | undefined,
  severity: string | undefined,
  alertId: string | undefined
) {
  const sp = new URLSearchParams();
  sp.append("page", page.toString());
  if (deviceId) sp.append("deviceId", deviceId);

  if (severity) sp.append("severity", severity);

  if (alertId) sp.append("alertId", alertId);

  return sp.toString();
}

async function AlertsPage({ searchParams }: AlertsPageProps) {
  const { page, deviceId, severity, alertId } = await searchParams;
  const pageNumber = parseInt(page ?? "1");
  const client = await createClient();
  const { data: devices } = await client
    .from("Devices")
    .select("*, DeviceType (type)")
    .order("name");

  let query = client
    .from("Alerts")
    .select("*, Devices (name)", { count: "exact" });

  if (deviceId) query = query.eq("device_id", deviceId);

  if (severity) query = query.eq("severity", severity);

  if (alertId) query = query.eq("id", alertId);

  const { data: alerts, count: totalItems } = await query
    .limit(100)
    .range((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE - 1);

  const pageCount = Math.ceil((totalItems ?? PAGE_SIZE) / PAGE_SIZE);
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AlertsFilter devices={devices as Device[]} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Alert ID</TableHead>
                <TableHead>Device Name</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Oops! No alerts found with these criteria.
                  </TableCell>
                </TableRow>
              )}
              {alerts?.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.id}</TableCell>
                  <TableCell className="font-medium">
                    <Link
                      className="text-indigo-500 hover:text-indigo-700 transition ease-in-out flex items-center gap-2"
                      href={`/dashboard/devices/${alert.device_id}`}
                    >
                      {alert.Devices.name}
                      <LinkIcon size={14} />
                    </Link>
                  </TableCell>
                  <TableCell>{alert.severity}</TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>
                    {new Date(alert.created_at).toLocaleString("el-GR", {
                      hour12: false,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href={`/dashboard/alerts?${createQueryParams(pageNumber === 1 ? 1 : pageNumber - 1, deviceId, severity, alertId)}`}
                        >
                          Previous
                        </PaginationPrevious>
                      </PaginationItem>
                      {pageNumber > 2 && (
                        <PaginationItem>
                          <PaginationLink
                            href={`/dashboard/alerts?${createQueryParams(1, deviceId, severity, alertId)}`}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      {pageNumber > 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      {pageNumber > 1 && (
                        <PaginationItem>
                          <PaginationLink
                            href={`/dashboard/alerts?${createQueryParams(pageNumber - 1, deviceId, severity, alertId)}`}
                          >
                            {pageNumber - 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationLink
                          href={`/dashboard/alerts?${createQueryParams(pageNumber, deviceId, severity, alertId)}`}
                          isActive
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>

                      {pageCount > pageNumber && (
                        <PaginationItem>
                          <PaginationLink
                            href={`/dashboard/alerts?${createQueryParams(pageNumber + 1, deviceId, severity, alertId)}`}
                          >
                            {pageNumber + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      {pageCount - 2 > pageNumber && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      {pageCount - 2 > pageNumber && (
                        <PaginationItem>
                          <PaginationLink
                            href={`/dashboard/alerts?${createQueryParams(pageCount, deviceId, severity, alertId)}`}
                          >
                            {pageCount}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href={`/dashboard/alerts?${createQueryParams(pageNumber === pageCount ? pageNumber : pageNumber + 1, deviceId, severity, alertId)}`}
                        >
                          Next
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default AlertsPage;
