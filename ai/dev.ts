import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-actions-for-resolution.ts';
import '@/ai/flows/route-complaint-to-department.ts';
import '@/ai/flows/get-complaint-status.ts';
