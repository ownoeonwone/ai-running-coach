import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
const { activity, onboardingData } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert running coach analyzing a completed workout. Provide specific, actionable feedback based on the run data and the athlete's profile. Be encouraging but honest about areas for improvement.

Consider:
- Pace consistency and appropriateness
- Heart rate zones and effort level
- Distance relative to their goals
- Recovery needs
- Training adaptations

Keep feedback to 2-3 sentences, warm and supportive tone.`
        },
        {
          role: "user",
          content: `Analyze this run:
          Run: ${activity.distance} miles in ${activity.duration}
          Pace: ${activity.pace}/mile
          Heart Rate: ${activity.heartRate} bpm average
          Effort: ${activity.effort}
          Route: ${activity.route}
          Weather: ${activity.weather}
          Elevation: ${activity.elevation}ft
          
          Runner Profile:
          Goal: ${onboardingData.primaryGoal}
          Fitness Level: ${onboardingData.fitnessLevel}
          Current weekly miles: ${onboardingData.weeklyMiles}
          
          Provide coaching feedback on this specific run.`
        }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const feedback = completion.choices[0]?.message?.content;

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Activity analysis error:', error);
    return NextResponse.json({ 
      feedback: "Great job getting out there! Keep up the consistent effort - every run is building your fitness." 
    });
  }
}
