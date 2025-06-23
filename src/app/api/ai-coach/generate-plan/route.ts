import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { onboardingData, userProfile, currentWeek } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert running coach creating personalized training plans. Generate a weekly training schedule based on the runner's profile, goals, and constraints.

Response format should be JSON:
{
  "week": "Week X of Y",
  "phase": "Training phase description",
  "runs": [
    {
      "day": "Monday",
      "type": "Rest|Easy|Tempo|Intervals|Long",
      "distance": 0,
      "description": "Detailed workout description"
    }
  ]
}`
        },
        {
          role: "user",
          content: `Create a training plan for: 
          Goal: ${onboardingData.primaryGoal}
          Current fitness: ${onboardingData.fitnessLevel}
          Weekly miles: ${onboardingData.weeklyMiles}
          Available days: ${onboardingData.runningDays}
          Time per session: ${onboardingData.timeAvailable}
          Race date: ${onboardingData.raceDate || 'None specified'}
          Injury history: ${onboardingData.injuryHistory || 'None'}
          
          This is week ${currentWeek} of their plan.`
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const planText = completion.choices[0]?.message?.content;
    
    let plan;
    try {
      plan = JSON.parse(planText || '{}');
    } catch {
      plan = {
        week: `Week ${currentWeek}`,
        phase: "Base Building",
        runs: [],
        isGenerated: true
      };
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Plan generation error:', error);
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
  }
}
