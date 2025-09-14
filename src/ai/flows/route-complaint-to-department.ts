'use server';
/**
 * @fileOverview This file defines a Genkit flow for routing citizen complaints to the correct department.
 *
 * - routeComplaint - A function that takes complaint details and routes it to the appropriate department.
 * - RouteComplaintInput - The input type for the routeComplaint function.
 * - RouteComplaintOutput - The return type for the routeComplaint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RouteComplaintInputSchema = z.object({
  complaintText: z.string().describe('The text description of the complaint.'),
  complaintCategory: z.string().describe('The category of the complaint (e.g., potholes, water leaks).'),
  location: z.string().describe('The location of the complaint.'),
});
export type RouteComplaintInput = z.infer<typeof RouteComplaintInputSchema>;

const RouteComplaintOutputSchema = z.object({
  department: z.string().describe('The department to which the complaint should be routed (e.g., Municipal Corporation, Police, Electricity Board, Water Supply Authority).'),
  reason: z.string().describe('The AI reason for routing the complaint to the suggested department.'),
});
export type RouteComplaintOutput = z.infer<typeof RouteComplaintOutputSchema>;

export async function routeComplaint(input: RouteComplaintInput): Promise<RouteComplaintOutput> {
  return routeComplaintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'routeComplaintPrompt',
  input: {schema: RouteComplaintInputSchema},
  output: {schema: RouteComplaintOutputSchema},
  prompt: `You are an AI assistant specializing in routing citizen complaints to the correct department in India.

  Given the following complaint details, determine the most appropriate department to handle the complaint.

  Complaint Text: {{{complaintText}}}
  Complaint Category: {{{complaintCategory}}}
  Location: {{{location}}}

  Available Departments: Municipal Corporation, Police, Electricity Board, Water Supply Authority

  Consider the nature of the complaint, its category, and location when making your determination. Explain the reason for your department choice.
  Return the department name exactly as it appears in the Available Departments list.
  Make sure the department choice aligns with the complaint category. For example, electricity-related issues should go to the Electricity Board.
`,
});

const routeComplaintFlow = ai.defineFlow(
  {
    name: 'routeComplaintFlow',
    inputSchema: RouteComplaintInputSchema,
    outputSchema: RouteComplaintOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
