import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { onboardingData } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert running coach analyzing a new athlete's profile. Based on their onboarding responses, provide insights about their fitness level, goals, and training readiness.`
        },
        {
          role: "user",
          content: `Analyze this runner's profile: ${JSON.stringify(onboardingData)}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const analysis = completion.choices[0]?.message?.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Onboarding analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze onboarding' }, { status: 500 });
  }
}
