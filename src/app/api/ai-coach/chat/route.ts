import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
/* eslint-disable @typescript-eslint/no-explicit-any */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, userProfile, recentActivities, onboardingData, trainingPlan } = await request.json();

    const systemPrompt = `You are an expert AI running coach with decades of experience. You provide warm, supportive, and encouraging advice while being realistic and science-based.

Runner Profile:
- Name: ${userProfile?.name || 'Runner'}
- Goal: ${userProfile?.currentGoal || 'General fitness'}
- Weekly Miles: ${userProfile?.weeklyMiles || 'Unknown'}
- Target: ${userProfile?.targetWeeklyMiles || 'Unknown'} miles/week
- Next Race: ${userProfile?.nextRace || 'None'} on ${userProfile?.raceDate || 'TBD'}

Training Background:
- Fitness Level: ${onboardingData?.fitnessLevel || 'Unknown'}
- Primary Goal: ${onboardingData?.primaryGoal || 'Unknown'}
- Available Days: ${onboardingData?.runningDays || 'Unknown'}
- Time Available: ${onboardingData?.timeAvailable || 'Unknown'}
- Injury History: ${onboardingData?.injuryHistory || 'None mentioned'}
- Running Experience: ${onboardingData?.previousExperience || 'Unknown'}
- Motivations: ${onboardingData?.motivations || 'Unknown'}

Recent Activities:
${recentActivities?.map((activity: any) => 
  `- ${activity.date}: ${activity.distance}mi in ${activity.duration} (${activity.pace}/mi pace, ${activity.heartRate}bpm avg HR, ${activity.effort} effort)`
).join('\n') || 'No recent activities'}

Current Training Plan: ${trainingPlan?.phase || 'Setting up plan'}

Coaching Style:
- Be warm, supportive, and encouraging
- Give specific, actionable advice
- Reference their actual training data when relevant
- Be realistic about goals and expectations
- Use running science and best practices
- Keep responses conversational and personal
- Address them by name when appropriate
- Provide practical tips for training, nutrition, recovery, and race strategy`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content || "I'm here to help with your running! Could you tell me more about your question?";

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      response: "I'm having trouble connecting right now, but I'm here to help with your running goals! Could you try asking again?" 
    });
  }
}
