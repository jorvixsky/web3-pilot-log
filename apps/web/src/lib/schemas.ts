import { z } from "zod";

export const licenseSchema = z.object({
  name: z.string().min(1, {
    message: "Your name can't be empty",
  }),
  licenseNumber: z.string().min(1, {
    message:
      "Your license number can't be empty. Write Student Pilot if you are working towards a license",
  }),
  licenses: z
    .array(
      z.object({
        name: z.string(),
        issueDate: z.string().optional(),
        licenseNumber: z.string().optional(),
      })
    )
    .min(1, {
      message:
        "You must have at least one license. If you are working towards a license, please select Student Pilot",
    }),
  ratings: z.array(z.any()).optional(),
  aircraftTypeRatings: z.array(z.string()).optional(),
});

export const flightSchema = z.object({
  date: z.date(),
  departure: z.object({
    place: z.string().min(1, {
      message: "The departure place can't be empty",
    }),
    time: z.string().min(1, {
      message: "The departure time can't be empty",
    }),
  }),
  arrival: z.object({
    place: z.string().min(1, {
      message: "The arrival place can't be empty",
    }),
    time: z.string().min(1, {
      message: "The arrival time can't be empty",
    }),
  }),
  aircraft: z.object({
    model: z.string().min(1, {
      message: "The aircraft model can't be empty",
    }),
    registration: z.string().min(1, {
      message: "The aircraft registration can't be empty",
    }),
  }),
  pics: z.string(),
  isSinglePilotTime: z.boolean(),
  singlePilotTime: z.object({
    singleEngine: z.boolean(),
    multiEngine: z.boolean(),
  }),
  multiPilotTime: z.object({
    hours: z.number(),
    minutes: z.number(),
  }),
  totalTimeOfFlight: z.object({
    hours: z.number(),
    minutes: z.number(),
  }),
  numberOfLandings: z.object({
    day: z.number(),
    night: z.number(),
  }),
  conditionsOfFlight: z.object({
    night: z.object({
      hours: z.number(),
      minutes: z.number(),
    }),
    ifr: z.object({
      hood: z.object({
        hours: z.number(),
        minutes: z.number(),
      }),
      actual: z.object({
        hours: z.number(),
        minutes: z.number(),
      }),
    }),
    flightRules: z.string(),
  }),
  pilotFunctionTime: z.object({
    pic: z.object({
      hours: z.number(),
      minutes: z.number(),
    }),
    copilot: z.object({
      hours: z.number(),
      minutes: z.number(),
    }),
    dual: z.object({
      hours: z.number(),
      minutes: z.number(),
    }),
    fi: z.object({
      hours: z.number(),
      minutes: z.number(),
    }),
  }),
  fstdSession: z.object({
    date: z.date(),
    type: z.string(),
    totalTime: z.object({
      hours: z.number(),
      minutes: z.number(),
    }),
  }),
  remarks: z.string(),
  selfSigned: z.boolean(),
  signedBy: z.string(), // To handle the case where the attestation should be signed by another pilot
});
