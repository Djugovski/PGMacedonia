import { z } from 'zod'

/**
 * Shared request-body schemas. Keeping them small and explicit — no
 * surprise fields, and hard caps everywhere so a bot can't dump a
 * megabyte of text into the email.
 */

const metaValue = z.union([z.string().max(500), z.number(), z.boolean(), z.null(), z.undefined()])

const InquiryKind = z.enum(['general', 'tandem', 'guiding'])

// Math captcha fields — the server re-evaluates the question string itself,
// see server/captcha.ts. Kept optional here so schema parsing surfaces the
// "missing" case as a proper captcha error rather than a generic 400.
const captchaFields = {
  captchaQuestion: z.string().trim().min(1).max(32).optional(),
  captchaAnswer: z.number().int().min(-200).max(1000).optional(),
}

export const ContactPayloadSchema = z
  .object({
    kind: InquiryKind,
    name: z.string().trim().min(1).max(200),
    email: z.string().trim().email().max(320),
    subject: z.string().trim().max(300).optional(),
    message: z.string().trim().max(5000),
    meta: z.record(z.string().max(40), metaValue).optional(),
    ...captchaFields,
  })
  .strict()

export type ContactPayload = z.infer<typeof ContactPayloadSchema>

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')

export const CalendarRequestSchema = z
  .object({
    start: IsoDate,
    end: IsoDate,
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().max(100).optional(),
    email: z.string().trim().email().max(320),
    phone: z.string().trim().max(40).optional(),
    message: z.string().trim().max(2000).optional(),
    ...captchaFields,
  })
  .strict()
  .refine((v) => v.start <= v.end, {
    message: 'End date must be on or after start',
    path: ['end'],
  })

export type CalendarRequestBody = z.infer<typeof CalendarRequestSchema>
