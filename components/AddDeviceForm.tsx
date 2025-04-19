"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormDescription,
  FormMessage,
  FormItem,
  FormLabel,
  FormControl,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDeviceAction, updateDeviceAction } from "@/app/actions";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  name: z.string().min(2),
  typeId: z.string().min(1, { message: "Device type is required" }),
});

function AddDeviceForm({
  isUpdate,
  device,
}: {
  isUpdate?: boolean;
  device: { id: number; name: string; typeId: string } | null;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: device?.name ?? "",
      typeId: device?.typeId.toString() ?? "1",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const data = new FormData();
    data.append("name", values.name);
    data.append("typeId", values.typeId);

    if (isUpdate) {
      if (device) data.append("id", device.id?.toString());
      // console.log(data);
      await updateDeviceAction(data);
    } else {
      await addDeviceAction(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device Name</FormLabel>
              <FormControl>
                <Input placeholder="Home Device" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        {!isUpdate && (
          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">BasicV1</SelectItem>
                    <SelectItem value="2">StandardV1</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button className="w-full mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default AddDeviceForm;
