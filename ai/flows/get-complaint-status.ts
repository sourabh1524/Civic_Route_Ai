
'use server';
/**
 * @fileOverview This file defines a Genkit flow for getting the status of a citizen complaint.
 *
 * - getComplaintStatus - A function that takes a tracking ID and returns a conversational status update.
 * - GetComplaintStatusInput - The input type for the getComplaintStatus function.
 * - GetComplaintStatusOutput - The return type for the getComplaintStatus function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Complaint } from '@/lib/types';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

// In a real application, you would fetch this from a database.
// We are mocking this data for demonstration purposes.
const getComplaintById = (id: string): Complaint | null => {
  const storedComplaints: Complaint[] = [
      { id: 'CMPT-1234', category: 'Potholes', date: '2024-07-28', status: 'In Progress', department: 'Municipal Corporation', isPriority: true },
      { id: 'CMPT-5678', category: 'Water Leakage', date: '2024-07-27', status: 'Resolved', department: 'Water Supply Authority' },
      { id: 'CMPT-9012', category: 'Streetlight Outage', date: '2024-07-26', status: 'Submitted', department: 'Electricity Board' },
      { id: 'CMPT-3456', category: 'Garbage Collection', date: '2024-07-25', status: 'Rejected', department: 'Municipal Corporation' },
  ];
  const foundComplaint = storedComplaints.find(c => c.id.toLowerCase() === id.toLowerCase());
  if (foundComplaint) return foundComplaint;

  try {
    const localComplaints: Complaint[] = JSON.parse(localStorage.getItem('complaints') || '[]');
    return localComplaints.find(c => c.id.toLowerCase() === id.toLowerCase()) || null;
  } catch (error) {
    // localStorage is not available in the server environment
    return null;
  }
};


const ComplaintSchema = z.object({
  id: z.string(),
  category: z.string(),
  date: z.string(),
  status: z.enum(['Submitted', 'In Progress', 'Resolved', 'Rejected']),
  department: z.string(),
  isPriority: z.boolean().optional(),
});

const GetComplaintStatusInputSchema = z.object({
  trackingId: z.string().describe('The unique tracking ID of the complaint.'),
});
export type GetComplaintStatusInput = z.infer<typeof GetComplaintStatusInputSchema>;

const GetComplaintStatusOutputSchema = z.object({
  complaint: ComplaintSchema,
  statusMessage: z.string().describe('A friendly, conversational message summarizing the complaint status.'),
  audioResponse: z.string().optional().describe("A data URI of the spoken status message, in WAV format. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GetComplaintStatusOutput = z.infer<typeof GetComplaintStatusOutputSchema>;

const getComplaintTool = ai.defineTool(
    {
      name: 'getComplaintTool',
      description: 'Get the details of a complaint by its tracking ID.',
      inputSchema: z.object({ trackingId: z.string() }),
      outputSchema: ComplaintSchema.nullable(),
    },
    async (input) => {
        return getComplaintById(input.trackingId);
    }
);


export async function getComplaintStatus(
  input: GetComplaintStatusInput
): Promise<GetComplaintStatusOutput> {
  return getComplaintStatusFlow(input);
}


const ttsFlow = ai.defineFlow(
  {
    name: 'ttsFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (text) => {
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: text,
      });

    if (!media) {
      throw new Error('No audio was generated.');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBuffer = await toWav(audioBuffer);
    return `data:audio/wav;base64,${wavBuffer}`;
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


const statusPrompt = ai.definePrompt({
    name: 'getComplaintStatusPrompt',
    tools: [getComplaintTool],
    prompt: `You are a helpful AI assistant for a civic services portal. A user wants to check the status of their complaint.
    Use the provided tool to look up the complaint by its tracking ID: {{{trackingId}}}.

    Once you have the complaint details, provide a short, friendly, and conversational summary of the status.
    - If the complaint is "In Progress", be encouraging.
    - If it's "Resolved", be congratulatory.
    - If it's "Submitted", let them know it's in the queue.
    - If it's "Rejected", be empathetic and briefly state why if a reason is available (for this task, assume no reason is available).
    - If no complaint is found, clearly state that.
    `,
});


const getComplaintStatusFlow = ai.defineFlow(
  {
    name: 'getComplaintStatusFlow',
    inputSchema: GetComplaintStatusInputSchema,
    outputSchema: GetComplaintStatusOutputSchema,
  },
  async (input) => {
    const llmResponse = await statusPrompt(input);
    const complaint = getComplaintById(input.trackingId);

    if (!complaint) {
        throw new Error(`Complaint with ID "${input.trackingId}" not found.`);
    }
    
    const textResponse = llmResponse.text;
    const audioResponse = await ttsFlow(textResponse);

    return {
        complaint,
        statusMessage: textResponse,
        audioResponse: audioResponse,
    };
  }
);
