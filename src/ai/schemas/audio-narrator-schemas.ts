import { z } from 'genkit';

export const AudioNarratorOutputSchema = z.object({
  media: z.string().describe("The base64 encoded WAV audio data URI."),
});
export type AudioNarratorOutput = z.infer<typeof AudioNarratorOutputSchema>;
