import { z } from "zod";

export const licenseSchema = z.object({
  name: z.string().min(1, {
    message: "Your name can't be empty",
  }),
  licenseNumber: z.string().min(1, {
    message: "Your license number can't be empty",
  }),
  licenses: z.array(z.any()).min(1, {
    message:
      "You must have at least one license. If you are working towards a license, please select Student Pilot",
  }),
  ratings: z.array(z.string()).min(1, {
    message:
      "You must have at least one rating. If you are working towards a rating, please select the rating you are working towards",
  }),
  aircraftTypeRatings: z.array(z.string()).optional(),
});
