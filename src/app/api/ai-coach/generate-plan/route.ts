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

IMPORTANT: Respond with ONLY valid JSON in this exact format:
{
  "week": "Week X of Y",
  "phase": "Training phase description",
  "runs": [
    {
      "day": "Monday",
      "type": "Rest",
      "distance": 0,
      "description": "Complete rest day for recovery"
    },
    {
      "day": "Tuesday", 
      "type": "Easy",
      "distance": 4,
      "description": "Easy pace run for base building"
    }
  ]
}

Use these workout types: Rest, Easy, Tempo, Intervals, Long, Recovery
Provide 7 days (Monday through Sunday) with realistic distances and descriptions.`
        },
        {
          role: "user",
          content: `Create a training plan for week ${currentWeek || 1}:

Runner Profile:
- Name: ${userProfile?.name || 'Runner'}
- Current Goal: ${userProfile?.currentGoal || onboardingData?.primaryGoal || 'General fitness'}
- Current Weekly Miles: ${userProfile?.weeklyMiles || 'Unknown'}
- Target Weekly Miles: ${userProfile?.targetWeeklyMiles || 'Unknown'}

Training Preferences:
- Goal: ${onboardingData?.primaryGoal || 'General fitness'}
- Current fitness: ${onboardingData?.fitnessLevel || 'Beginner'}
- Weekly miles: ${onboardingData?.weeklyMiles || '10-20 miles'}
- Available days: ${onboardingData?.runningDays || '4 days'}
- Time per session: ${onboardingData?.timeAvailable || '45 minutes'}
- Race date: ${onboardingData?.raceDate || 'None specified'}
- Injury history: ${onboardingData?.injuryHistory || 'None'}

Create a safe, progressive weekly plan appropriate for their fitness level and goals.`
        }
      ],
      max_tokens: 800,
      temperature: 0.6,
    });

    const planText = completion.choices[0]?.message?.content;
    
    let plan;
    try {
      // Clean the response to extract just the JSON
      const jsonMatch = planText?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse plan:', parseError);
      // Fallback plan
      plan = {
        week: `Week ${currentWeek || 1}`,
        phase: "Base Building Phase",
        runs: [
          { day: "Monday", type: "Rest", distance: 0, description: "Complete rest day for recovery" },
          { day: "Tuesday", type: "Easy", distance: 3, description: "Easy pace run - conversational effort" },
          { day: "Wednesday", type: "Rest", distance: 0, description: "Rest or cross-training" },
          { day: "Thursday", type: "Easy", distance: 4, description: "Easy pace run with focus on form" },
          { day: "Friday", type: "Rest", distance: 0, description: "Rest day" },
          { day: "Saturday", type: "Long", distance: 6, description: "Long run at easy pace" },
          { day: "Sunday", type: "Recovery", distance: 2, description: "Short recovery run or walk" }
        ],
        isGenerated: true
      };
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Plan generation error:', error);
    return NextResponse.json({ 
      plan: {
        week: "Week 1",
        phase: "Base Building Phase", 
        runs: [
          { day: "Monday", type: "Rest", distance: 0, description: "Rest day" },
          { day: "Tuesday", type: "Easy", distance: 3, description: "Easy run" },
          { day: "Wednesday", type: "Rest", distance: 0, description: "Rest day" },
          { day: "Thursday", type: "Easy", distance: 4, description: "Easy run" },
          { day: "Friday", type: "Rest", distance: 0, description: "Rest day" },
          { day: "Saturday", type: "Long", distance: 6, description: "Long run" },
          { day: "Sunday", type: "Recovery", distance: 2, description: "Recovery run" }
        ],
        isGenerated: true
      }
    });
  }
}
