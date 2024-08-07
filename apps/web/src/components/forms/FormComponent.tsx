import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface OptionType {
  label: string;
  value: string;
}

interface FormFieldProps {
  form: any;
  name: string;
  label?: string | null;
  placeholder?: any;
  description?: string;
  type: string;
  options?: OptionType[];
  classname?: string;
  accept?: string;
  disabled?: boolean;
  step?: number;
}

const inputSelector = (
  type: string,
  placeholder: string,
  field: any,
  options: OptionType[],
  accept?: string,
  disabled?: boolean,
  step?: number
) => {
  switch (type) {
    case "number":
      return (
        <Input
          placeholder={field.placeholder}
          value={field.value}
          type={type}
          onChange={(e) => {
            if (isNaN(e.target.valueAsNumber)) {
              field.onChange(null);
            } else {
              field.onChange(e.target.valueAsNumber);
            }
          }}
          step={1}
          disabled={disabled}
        />
      );
    case "calendar":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    case "time":
      return (
        <Input
          placeholder={field.placeholder}
          value={field.value}
          type={type}
          onChange={(e) => {
            field.onChange(e.target.value);
          }}
          className={cn("flex items-center justify-between w-full")}
          step={step ? step : 60}
          disabled={disabled}
        />
      );
    /* case "select":
      if (!options)
        return (
          <div className="w-full h-9 bg-gray-200 animate-pulse rounded-md shadow-sm" />
        );
      return (
        <Select
          value={field.value}
          onChange={field.onChange}
          options={options}
          placeholder={placeholder}
          disabled={disabled}
        />
      );*/
    default:
      return (
        <Input
          placeholder={placeholder}
          value={field.value}
          type={type}
          onChange={(e) => {
            field.onChange(e.target.value);
          }}
          disabled={disabled}
        />
      );
  }
};

const FormComponent: React.FC<FormFieldProps> = (props) => {
  const {
    form,
    name,
    label,
    placeholder,
    description,
    type,
    options,
    classname,
    accept,
    disabled,
    step,
  } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn("w-full", classname)}>
            {label && <FormLabel className="">{label}</FormLabel>}
            <FormControl>
              {inputSelector(
                type,
                placeholder,
                field,
                options as OptionType[],
                accept,
                disabled,
                step
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export { FormComponent };
