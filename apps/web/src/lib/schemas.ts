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
