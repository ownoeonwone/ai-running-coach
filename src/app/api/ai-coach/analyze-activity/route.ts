/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { activity, onboardingData, userProfile, recentActivities } = await request.json();

    // Enhanced analysis with trend detection
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert running coach analyzing a workout with access to comprehensive data. Provide detailed, actionable feedback considering trends across multiple runs.

Key Analysis Areas:
- Pace consistency and appropriateness for training zones
- Heart rate data accuracy and zones (flag if wrist-based HR seems inaccurate)
- Elevation and terrain impact
- Weather conditions and adaptation
- Training load and recovery needs
- Progress trends vs recent activities
- Risk factors (overtraining, injury potential)

Provide specific coaching advice in 2-3 sentences. Be encouraging but scientifically accurate. Reference specific data from this run.`
        },
        {
          role: "user",
          content: `Analyze this specific run with full context:

Current Run: "${activity.name || activity.route}"
- Date: ${activity.date}
- Distance: ${activity.distance} miles
- Time: ${activity.duration}
- Pace: ${activity.pace}/mile
- Avg HR: ${activity.heartRate || 'N/A'} bpm
- Max HR: ${activity.maxHeartRate || 'N/A'} bpm
- Elevation: ${activity.elevation}ft gain
- Weather: ${activity.weather || 'Unknown'}
- Effort: ${activity.effort}
- Kudos: ${activity.kudos || 0}

Recent Activity Context (last 5 runs for trend analysis):
${recentActivities?.slice(0, 5).map((run: any, index: number) => 
  `${index + 1}. ${run.date}: ${run.distance}mi, ${run.pace}/mi pace, ${run.heartRate || 'N/A'}bpm HR, ${run.effort} effort`
).join('\n') || 'No previous runs available'}

Runner Profile:
- Name: ${userProfile?.name || 'Runner'}
- Current Goal: ${userProfile?.currentGoal || onboardingData?.primaryGoal || 'General fitness'}
- Current Weekly Miles: ${userProfile?.weeklyMiles || 'Unknown'}
- Target Weekly Miles: ${userProfile?.targetWeeklyMiles || 'Unknown'}
- Fitness Level: ${onboardingData?.fitnessLevel || 'Unknown'}
- Training Days: ${onboardingData?.runningDays || 'Unknown'}
- Injury history: ${onboardingData?.injuryHistory || 'None'}

Provide coaching analysis specifically for this run, considering performance trends and the runner's goals.`
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const feedback = completion.choices[0]?.message?.content;

    // Detect if training plan adjustment might be needed
    const needsPlanAdjustment = checkForPlanAdjustment(activity, recentActivities);
    const heartRateWarning = checkHeartRateAccuracy(activity, recentActivities);

    return NextResponse.json({ 
      feedback: feedback || "Great job on this run! Your consistency and effort are building a strong foundation for your running goals.",
      needsPlanAdjustment,
      heartRateWarning
    });
  } catch (error) {
    console.error('Activity analysis error:', error);
    return NextResponse.json({ 
      feedback: "Excellent work getting out there! Every run contributes to your fitness journey. Keep building that aerobic base!",
      needsPlanAdjustment: false,
      heartRateWarning: null
    });
  }
}

function checkForPlanAdjustment(activity: any, recentActivities: any[]): boolean {
  if (!recentActivities || recentActivities.length < 3) return false;
  
  // Simple logic - if pace is consistently faster or slower than recent average
  const recentPaces = recentActivities.slice(0, 5)
    .map(run => {
      const [minutes, seconds] = run.pace.split(':').map(Number);
      return minutes + seconds / 60;
    });
  
  const avgPace = recentPaces.reduce((sum, pace) => sum + pace, 0) / recentPaces.length;
  const currentPaceMinutes = activity.pace.split(':').map(Number);
  const currentPace = currentPaceMinutes[0] + currentPaceMinutes[1] / 60;
  
  return Math.abs(currentPace - avgPace) > 0.5; // If pace differs by more than 30 seconds
}

function checkHeartRateAccuracy(activity: any, recentActivities: any[]): string | null {
  if (!activity.heartRate || !activity.maxHeartRate) return null;
  
  const recentMaxHRs = recentActivities
    .filter(run => run.maxHeartRate)
    .map(run => run.maxHeartRate)
    .slice(0, 5);
  
  if (recentMaxHRs.length === 0) return null;
  
  const avgMaxHR = recentMaxHRs.reduce((sum, hr) => sum + hr, 0) / recentMaxHRs.length;
  
  if (Math.abs(activity.maxHeartRate - avgMaxHR) > 40) {
    return "Your heart rate data shows unusual spikes. Consider using a chest strap for more accurate readings during training.";
  }
  
  return null;
}
