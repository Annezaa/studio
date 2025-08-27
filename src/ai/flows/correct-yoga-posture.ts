'use server';

/**
 * @fileOverview An AI agent that evaluates and corrects yoga postures in real-time.
 *
 * - correctYogaPosture - A function that handles the yoga posture analysis and correction process.
 * - CorrectYogaPostureInput - The input type for the correctYogaPosture function.
 * - CorrectYogaPostureOutput - The return type for the correctYogaPosture function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CorrectYogaPostureInputSchema = z.object({
  cameraFeedDataUri: z
    .string()
    .describe(
      "A real-time camera feed of the user performing a yoga posture, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  poseDescription: z.string().describe('The name or description of the yoga pose being performed.'),
});
export type CorrectYogaPostureInput = z.infer<typeof CorrectYogaPostureInputSchema>;

const CorrectYogaPostureOutputSchema = z.object({
  accuracyScore: z
    .number()
    .describe('A score (0-100) representing the accuracy of the yoga posture.'),
  feedback: z.string().describe('Specific feedback on how to improve the yoga posture, in Indonesian.'),
});
export type CorrectYogaPostureOutput = z.infer<typeof CorrectYogaPostureOutputSchema>;

export async function correctYogaPosture(input: CorrectYogaPostureInput): Promise<CorrectYogaPostureOutput> {
  return correctYogaPostureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'correctYogaPosturePrompt',
  input: {schema: CorrectYogaPostureInputSchema},
  output: {schema: CorrectYogaPostureOutputSchema},
  prompt: `You are an expert yoga instructor. You will analyze the user's yoga posture based on a real-time camera feed and provide a score and specific feedback. **All of your responses must be in Indonesian.**

  The user is attempting the following yoga pose: {{{poseDescription}}}.

  Analyze the user's posture from the camera feed: {{media url=cameraFeedDataUri}}.

  Provide an accuracy score (0-100) and specific, actionable feedback on how to improve the posture. Focus on alignment, balance, and form.
  The accuracy score should reflect how closely the user matches perfect form.
  The feedback must be specific to what the image in cameraFeedDataUri shows.`,
});

const correctYogaPostureFlow = ai.defineFlow(
  {
    name: 'correctYogaPostureFlow',
    inputSchema: CorrectYogaPostureInputSchema,
    outputSchema: CorrectYogaPostureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
