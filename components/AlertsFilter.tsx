"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect, useState } from "react";

export type Device = { id: number; name: string; DeviceType: { type: string } };
type AcceptedSearchParams = {
  page?: number | undefined;
  deviceId?: number | undefined;
  severity?: string | undefined;
  alertId?: number | undefined;
};

type AlertsFilterProps = {
  devices: Device[];
};

function AlertsFilter({ devices }: AlertsFilterProps) {
  const [alertId, setAlertId] = useState<string | undefined>();
  const [deviceId, setDeviceId] = useState<string>();
  const [severity, setSeverity] = useState<string>();

  const searchParams = useSearchParams();
  const navigation = useRouter();
  const pathname = usePathname();

  const onSearch = () => {
    const parameters = extractSearchParams();

    parameters.alertId = alertId ? parseInt(alertId) : undefined;
    parameters.deviceId =
      deviceId && deviceId !== "0" ? parseInt(deviceId) : undefined;
    parameters.severity = severity && severity !== "All" ? severity : undefined;

    const sp = new URLSearchParams(convertToArray(parameters));
    const queryParams = sp.size === 0 ? "" : `?${sp.toString()}`;
    console.log({ pathname, queryParams: sp.toString() });
    navigation.push(`${pathname}${queryParams}`);
  };

  const extractSearchParams = () => {
    const acceptedParams: AcceptedSearchParams = {};
    const params = Array.from(searchParams);
    if (params.length > 0) {
      acceptedParams.page = parseInt(findIn(params, "page") as string);
      acceptedParams.alertId = parseInt(findIn(params, "alertId") as string);
      acceptedParams.deviceId = parseInt(findIn(params, "deviceId") as string);
      acceptedParams.alertId = parseInt(findIn(params, "alertId") as string);
    }

    return acceptedParams;
  };

  function findIn(params: string[][], name: string): string | undefined {
    const namedData = params.filter((d) => d[0] === name);
    if (namedData.length === 0) return undefined;
    return namedData[0][1].length > 0 ? namedData[0][1] : undefined;
  }

  function convertToArray(sp: AcceptedSearchParams) {
    const result: string[][] = [];

    // if (sp.page) result.push(["page", sp.page.toString()]);

    if (sp.alertId) result.push(["alertId", sp.alertId.toString()]);

    if (sp.deviceId) result.push(["deviceId", sp.deviceId.toString()]);

    if (sp.severity) result.push(["severity", sp.severity]);

    return result;
  }

  useEffect(() => {
    const searchParams = extractSearchParams();
    setAlertId(searchParams.alertId?.toString());
    setDeviceId(searchParams.deviceId ? searchParams.deviceId.toString() : "0");
    setSeverity(searchParams.severity);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Alert Id</Label>
          <Input
            min="0"
            onChange={(e) => setAlertId(e.target.value)}
            value={alertId ?? ""}
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="0000"
            type="number"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Severity</Label>
          <Select defaultValue={severity} onValueChange={setSeverity}>
            <SelectTrigger className="focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label>Device</Label>
          <Select defaultValue={deviceId} onValueChange={setDeviceId}>
            <SelectTrigger className="focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All</SelectItem>
              {devices?.map((d) => (
                <SelectItem key={d.id} value={d.id.toString()}>
                  {d.name} ({d.DeviceType.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* <div className="flex flex-col gap-1">
              <Label>Date</Label>
              <DatePickerWithRange />
            </div> */}
        <Button className="self-end" onClick={onSearch}>
          Search
        </Button>
      </div>
      {/* <Button onClick={onSearch}>Search</Button> */}
    </>
  );
}

export default AlertsFilter;
