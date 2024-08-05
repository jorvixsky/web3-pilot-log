import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { flightSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useState } from "react";

export default function NewFlight() {
  const [selfSigned, setSelfSigned] = useState(false);
  const [isSinglePilotTime, setIsSinglePilotTime] = useState(true);

  const newFlightForm = useForm<z.infer<typeof flightSchema>>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      date: new Date(),
      departure: {
        place: "",
        time: "",
      },
      arrival: {
        place: "",
        time: "",
      },
      aircraft: {
        model: "",
        registration: "",
      },
      pics: [],
      isSinglePilotTime: true,
      singlePilotTime: {
        singleEngine: true,
        multiEngine: false,
      },
      totalTimeOfFlight: {
        hours: 0,
        minutes: 0,
      },
      numberOfLandings: {
        day: 0,
        night: 0,
      },
      conditionsOfFlight: {
        night: {
          hours: 0,
          minutes: 0,
        },
        ifr: {
          hood: {
            hours: 0,
            minutes: 0,
          },
          actual: {
            hours: 0,
            minutes: 0,
          },
        },
      },
      pilotFunctionTime: {
        pic: {
          hours: 0,
          minutes: 0,
        },
        copilot: {
          hours: 0,
          minutes: 0,
        },
        dual: {
          hours: 0,
          minutes: 0,
        },
        fi: {
          hours: 0,
          minutes: 0,
        },
      },
      selfSigned: true,
      signedBy: "",
    },
  });

  function onSubmit(values: z.infer<typeof flightSchema>) {
    console.log(values);
  }

  return (
    <div>
      <h1>New Flight</h1>
      <Form {...newFlightForm}>
        <form
          onSubmit={newFlightForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-96"
        >
          <FormField
            control={newFlightForm.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <Label className="font-bold">Departure</Label>
            <div className="flex gap-4">
              <FormField
                control={newFlightForm.control}
                name="departure.place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="LELL" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newFlightForm.control}
                name="departure.time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="12:00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label className="font-bold">Arrival</Label>
            <div className="flex gap-4">
              <FormField
                control={newFlightForm.control}
                name="arrival.place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="LELL" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newFlightForm.control}
                name="arrival.time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="12:00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label>Aircraft</Label>
            <div className="flex gap-4">
              <FormField
                control={newFlightForm.control}
                name="aircraft.model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make, model, variant</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="C150" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newFlightForm.control}
                name="aircraft.registration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="YL-NLO" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <FormField
              control={newFlightForm.control}
              name="pics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name(s) PIC</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Name(s) PIC" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <FormField
              control={newFlightForm.control}
              name="selfSigned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Self Signed</FormLabel>
                  <div className="flex gap-4">
                    <FormControl>
                      <Checkbox
                        checked={selfSigned}
                        onCheckedChange={() => {
                          setSelfSigned(!selfSigned);
                          field.onChange(!selfSigned);
                        }}
                        className="self-center"
                      />
                    </FormControl>
                    <FormDescription>
                      If you are the PIC signing the flight, please check this
                      box.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          {!selfSigned && (
            <div className="flex gap-4">
              <FormField
                control={newFlightForm.control}
                name="signedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signed By</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="instructor.eth" />
                    </FormControl>
                    <FormDescription>
                      The address of the pilot who signed the flight.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="flex gap-4">
            <FormField
              control={newFlightForm.control}
              name="isSinglePilotTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    Is single pilot time?
                  </FormLabel>
                  <div className="flex gap-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => {
                          setIsSinglePilotTime(!isSinglePilotTime);
                          field.onChange(!isSinglePilotTime);
                        }}
                        className="self-center"
                      />
                    </FormControl>
                    <FormDescription>
                      If the flight was flown as a single pilot, check this box.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          {isSinglePilotTime ? (
            <div className="flex flex-col gap-4">
              <Label className="font-bold">Single Pilot Time</Label>
              <div className="flex gap-4">
                <FormField
                  control={newFlightForm.control}
                  name="singlePilotTime.singleEngine"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-1">
                        <FormLabel>Single Engine</FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={() => {
                              field.onChange(true);
                              newFlightForm.setValue(
                                "singlePilotTime.multiEngine",
                                false
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={newFlightForm.control}
                  name="singlePilotTime.multiEngine"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-1">
                        <FormLabel>Multi Engine</FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={() => {
                              field.onChange(true);
                              newFlightForm.setValue(
                                "singlePilotTime.singleEngine",
                                false
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Label className="font-bold">Multi Pilot Time</Label>
              <div className="flex gap-4">
                <FormField
                  control={newFlightForm.control}
                  name="multiPilotTime.hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Multi Pilot Time (Hours)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          min={0}
                          value={field.value ? field.value : 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newFlightForm.control}
                  name="multiPilotTime.minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Multi Pilot Time (Minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={0} max={59} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-4">
            <Label className="font-bold">Total Time of Flight</Label>
            <div className="flex gap-4">
              <FormField
                control={newFlightForm.control}
                name="totalTimeOfFlight.hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newFlightForm.control}
                name="totalTimeOfFlight.minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} max={59} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label className="font-bold">Number of Landings</Label>
            <div className="flex gap-4">
              <FormField
                control={newFlightForm.control}
                name="numberOfLandings.day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newFlightForm.control}
                name="numberOfLandings.night"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Night</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label className="font-bold">Flight Conditions</Label>
          </div>
          <div className="flex gap-4">
            <FormField
              control={newFlightForm.control}
              name="conditionsOfFlight.night.hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Night Time (Hours)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newFlightForm.control}
              name="conditionsOfFlight.night.minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Night Time (Minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} max={59} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label className="font-bold">Conditions of Flight</Label>
            <div className="flex gap-4">
              <FormField
                control={newFlightForm.control}
                name="conditionsOfFlight.ifr.hood.hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFR Hood Time (Hours)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newFlightForm.control}
                name="conditionsOfFlight.ifr.hood.minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFR Hood Time (Minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} max={59} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newFlightForm.control}
                name="conditionsOfFlight.ifr.actual.hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFR Actual Time (Hours)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newFlightForm.control}
                name="conditionsOfFlight.ifr.actual.minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFR Actual Time (Minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} max={59} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newFlightForm.control}
                name="conditionsOfFlight.flightRules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flight Rules</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Flight Rules" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <FormField
              control={newFlightForm.control}
              name="pilotFunctionTime.pic.hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIC Hours</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newFlightForm.control}
              name="pilotFunctionTime.pic.minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIC Minutes</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} max={59} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newFlightForm.control}
              name="pilotFunctionTime.copilot.hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Copilot Hours</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newFlightForm.control}
              name="pilotFunctionTime.copilot.minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Copilot Minutes</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} max={59} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newFlightForm.control}
              name="pilotFunctionTime.dual.hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dual Hours</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newFlightForm.control}
              name="pilotFunctionTime.dual.minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dual Minutes</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} max={59} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newFlightForm.control}
              name="pilotFunctionTime.fi.hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FI Hours</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newFlightForm.control}
              name="pilotFunctionTime.fi.minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FI Minutes</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} max={59} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={newFlightForm.control}
              name="fstdSession.date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FSTD Session</FormLabel>
                  <FormControl>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newFlightForm.control}
              name="fstdSession.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FSTD Session Type</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="FSTD Session Type" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newFlightForm.control}
              name="fstdSession.totalTime.hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FSTD Session (Hours)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newFlightForm.control}
              name="fstdSession.totalTime.minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FSTD Session (Minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} max={59} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
