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
    place: z.string(),
    time: z.string(),
  }),
  arrival: z.object({
    place: z.string(),
    time: z.string(),
  }),
  aircraft: z.object({
    model: z.string(),
    registration: z.string(),
  }),
  pics: z.array(z.string()),
  isSinglePilotTime: z.boolean(),
  singlePilotTime: z.object({
    singleEngine: z.boolean(),
    multiEngine: z.boolean(),
  }),
  multiPilotTime: z
    .object({
      hours: z.number().optional(),
      minutes: z.number().optional(),
    })
    .optional(),
  totalTimeOfFlight: z.object({
    hours: z.number(),
    minutes: z.number(),
  }),
  numberOfLandings: z.object({
    day: z.number(),
    night: z.number(),
  }),
  conditionsOfFlight: z
    .object({
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
      flightRules: z.string().optional(),
    })
    .optional(),
  pilotFunctionTime: z.object({
    pic: z
      .object({
        hours: z.number(),
        minutes: z.number(),
      })
      .optional(),
    copilot: z
      .object({
        hours: z.number(),
        minutes: z.number(),
      })
      .optional(),
    dual: z
      .object({
        hours: z.number(),
        minutes: z.number(),
      })
      .optional(),
    fi: z
      .object({
        hours: z.number(),
        minutes: z.number(),
      })
      .optional(),
  }),
  fstdSession: z
    .object({
      date: z.date().optional(),
      type: z.string().optional(),
      totalTime: z.object({
        hours: z.number().optional(),
        minutes: z.number().optional(),
      }),
    })
    .optional(),
  remarks: z.string().optional(),
  selfSigned: z.boolean(),
  signedBy: z.string().optional(), // To handle the case where the attestation should be signed by another pilot
});
