import { z } from 'zod'

export const destinationSchema = z.object({
  name: z.string().min(1, 'Nome richiesto'),
  country: z.string().min(1, 'Paese richiesto'),
  category: z.string().default('mare'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
})

export const offerSchema = z.object({
  destinationId: z.string().min(1, 'Destinazione richiesta'),
  title: z.string().min(1, 'Titolo richiesto'),
  priceFrom: z.number().positive().optional(),
  affiliateLink: z.string().url('Link affiliato non valido'),
  description: z.string().optional(),
  notes: z.string().optional(),
})

export const videoSchema = z.object({
  destinationId: z.string().optional(),
  title: z.string().min(1, 'Titolo richiesto'),
  description: z.string().optional(),
  status: z.enum(['pianificato', 'ripresa', 'montaggio', 'pubblicato']).default('pianificato'),
  plannedDate: z.string().optional(),
  hashtags: z.string().optional(),
  tiktokUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
  offerIds: z.array(z.string()).optional(),
})

export type DestinationInput = z.infer<typeof destinationSchema>
export type OfferInput = z.infer<typeof offerSchema>
export type VideoInput = z.infer<typeof videoSchema>
