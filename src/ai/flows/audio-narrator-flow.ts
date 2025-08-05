
'use server';

/**
 * @fileOverview A Genkit flow to convert text to speech for yoga instruction narration.
 *
 * - audioNarrator - A function that takes text and returns a data URI for an audio file.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

export const AudioNarratorOutputSchema = z.object({
  media: z.string().describe("The base64 encoded WAV audio data URI."),
});
export type AudioNarratorOutput = z.infer<typeof AudioNarratorOutputSchema>;

export async function audioNarrator(text: string): Promise<AudioNarratorOutput> {
  return audioNarratorFlow(text);
}

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

const audioNarratorFlow = ai.defineFlow(
  {
    name: 'audioNarratorFlow',
    inputSchema: z.string(),
    outputSchema: AudioNarratorOutputSchema,
  },
  async (query) => {
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
      prompt: query,
    });

    if (!media) {
      throw new Error('No media was returned from the TTS model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
