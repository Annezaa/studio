'use server';

/**
 * @fileOverview A chatbot that answers questions from teenage girls about sports,
 * nutrition, menstruation, and mental health.
 *
 * - answerTeenQuestions - A function that answers the teen's question.
 * - AnswerTeenQuestionsInput - The input type for the answerTeenQuestions function.
 * - AnswerTeenQuestionsOutput - The return type for the answerTeenQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerTeenQuestionsInputSchema = z.object({
  query: z.string().describe('The question from the teenage girl.'),
});
export type AnswerTeenQuestionsInput = z.infer<typeof AnswerTeenQuestionsInputSchema>;

const AnswerTeenQuestionsOutputSchema = z.object({
  answer: z.string().describe('The empathetic and educational answer to the question.'),
});
export type AnswerTeenQuestionsOutput = z.infer<typeof AnswerTeenQuestionsOutputSchema>;

export async function answerTeenQuestions(input: AnswerTeenQuestionsInput): Promise<AnswerTeenQuestionsOutput> {
  return answerTeenQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerTeenQuestionsPrompt',
  input: {schema: AnswerTeenQuestionsInputSchema},
  output: {schema: AnswerTeenQuestionsOutputSchema},
  prompt: `You are a helpful, empathetic, and educational AI chatbot designed to answer questions from teenage girls about sports, nutrition, menstruation, and mental health.

  Question: {{{query}}}

  Answer: `,
});

const answerTeenQuestionsFlow = ai.defineFlow(
  {
    name: 'answerTeenQuestionsFlow',
    inputSchema: AnswerTeenQuestionsInputSchema,
    outputSchema: AnswerTeenQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
