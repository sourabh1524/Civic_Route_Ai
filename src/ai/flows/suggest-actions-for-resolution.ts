'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting actions for complaint resolution.
 *
 * - suggestActionsForResolution - A function that suggests appropriate actions for resolving a complaint.
 * - SuggestActionsForResolutionInput - The input type for the suggestActionsForResolution function.
 * - SuggestActionsForResolutionOutput - The return type for the suggestActionsForResolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActionsForResolutionInputSchema = z.object({
  complaintDescription: z
    .string()
    .describe('The description of the complaint submitted by the citizen.'),
  department: z.string().describe('The department to which the complaint is routed.'),
  relevantProtocols: z
    .string()
    .describe('A comprehensive list of public service protocols relevant to the department.'),
});
export type SuggestActionsForResolutionInput = z.infer<
  typeof SuggestActionsForResolutionInputSchema
>;

const SuggestActionsForResolutionOutputSchema = z.object({
  suggestedActions: z
    .array(z.string())
    .describe('A list of suggested actions for the resolving authority.'),
});
export type SuggestActionsForResolutionOutput = z.infer<
  typeof SuggestActionsForResolutionOutputSchema
>;

export async function suggestActionsForResolution(
  input: SuggestActionsForResolutionInput
): Promise<SuggestActionsForResolutionOutput> {
  return suggestActionsForResolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActionsForResolutionPrompt',
  input: {schema: SuggestActionsForResolutionInputSchema},
  output: {schema: SuggestActionsForResolutionOutputSchema},
  prompt: `You are an AI assistant helping resolving authorities to effectively resolve citizen complaints.

You will receive a complaint description, the department it has been routed to, and a list of relevant public service protocols.

Based on this information, suggest a series of appropriate actions for the resolving authority to take.

Complaint Description: {{{complaintDescription}}}
Department: {{{department}}}
Relevant Protocols: {{{relevantProtocols}}}

Suggested Actions:`,
});

const suggestActionsForResolutionFlow = ai.defineFlow(
  {
    name: 'suggestActionsForResolutionFlow',
    inputSchema: SuggestActionsForResolutionInputSchema,
    outputSchema: SuggestActionsForResolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
