import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
 
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

interface DatePickerProps {
    control: any;
}
interface DateTimePickerProps {
    control: any;
}
 
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
    return (
        <DayPicker
            disabled={props.disabled}
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
            ),
            day_range_end: "day-range-end",
            day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside:
                "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            ...classNames,
            }}
            components={{
            IconLeft: ({ className, ...props }) => (
                <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
            ),
            IconRight: ({ className, ...props }) => (
                <ChevronRight className={cn("h-4 w-4", className)} {...props} />
            ),
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

function DatePicker({control, ...props}: DatePickerProps & CalendarProps){
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-full justify-start text-left font-normal",
                    !control.value && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {control.value ? format(control.value, "PPP") : <span>MM/DD/YYYY</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                    mode="single"
                    selected={control.value}
                    onSelect={control.onChange}
                    initialFocus
                    {...props}
                />
            </PopoverContent>
        </Popover>
    )
}
DatePicker.displayName = "DatePicker"

function DateTimePicker({control, ...props}: DateTimePickerProps & CalendarProps){
    const [isOpen, setIsOpen] = React.useState(false);
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);    
    const handleTimeChange = ( type: "hour" | "minute" | "ampm", value: string, e: any ) => {
        e.preventDefault()
        if (control && control.value) {
            const newDate = new Date(control.value);
            if (type === "hour") {
            newDate.setHours(
                (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
            );
            } else if (type === "minute") {
            newDate.setMinutes(parseInt(value));
            } else if (type === "ampm") {
            const currentHours = newDate.getHours();
            newDate.setHours(
                value === "PM" ? currentHours + 12 : currentHours - 12
            );
            }
            control.onChange(newDate)
        }
    };
    
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
            <Button
                variant="outline"
                className={cn(
                "w-full justify-start text-left font-normal",
                control && !control.value && "text-muted-foreground"
                )}
                disabled={Boolean(props.disabled)}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {control && control.value ? (
                format(control.value, "dd-MMM-yyyy hh:mm aa")
                ) : (
                <span>dd-MMM-yyyy hh:mm aa</span>
                )}
            </Button>
            </PopoverTrigger>
            {!props.hidden && <PopoverContent className="w-auto p-0">
            <div className="sm:flex">
                <Calendar
                    mode="single"
                    selected={control.value}
                    onSelect={control.onChange}
                    initialFocus
                    {...props}
                />
                <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                    <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                        {hours.reverse().map((hour) => (
                            <Button
                                key={hour}
                                size="icon"
                                variant={
                                    control && control.value && control.value.getHours() % 12 === hour % 12
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={(e) => handleTimeChange("hour", hour.toString(), e)}
                                disabled={Boolean(props.disabled)}
                                >
                                {hour}
                            </Button>
                        ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="sm:hidden" />
                    </ScrollArea>
                    <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                        {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                            <Button
                                key={minute}
                                size="icon"
                                variant={
                                    control && control.value && control.value.getMinutes() === minute
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={(e) =>
                                    handleTimeChange("minute", minute.toString(), e)
                                }
                                disabled={Boolean(props.disabled)}
                                >
                                {minute}
                            </Button>
                        ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="sm:hidden" />
                    </ScrollArea>
                    <ScrollArea className="">
                        <div className="flex sm:flex-col p-2">
                        {["AM", "PM"].map((ampm) => (
                            <Button
                                key={ampm}
                                size="icon"
                                variant={
                                    control && control.value &&
                                    ((ampm === "AM" && control.value.getHours() < 12) ||
                                    (ampm === "PM" && control.value.getHours() >= 12))
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={(e) => handleTimeChange("ampm", ampm, e)}
                                disabled={Boolean(props.disabled)}
                            >
                            {ampm}
                            </Button>
                        ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
            </PopoverContent>}
        </Popover>
    );
}
DateTimePicker.displayName = "DateTimePicker"


 
export { Calendar, DatePicker, DateTimePicker }