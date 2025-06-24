/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken');
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Access token required' }, { status: 400 });
    }

    // Get activities from last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${Math.floor(threeMonthsAgo.getTime() / 1000)}&per_page=200`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Strava activities');
    }

    const activities = await response.json();
    
// Filter for runs only and format the data
const runs = activities
  .filter((activity: any) => activity.type === 'Run')
  .map((activity: any) => ({
    id: activity.id,
    name: activity.name, // This is the Strava activity title
    route: activity.name, // Use Strava title as route name
    date: activity.start_date.split('T')[0], // Format date properly
    distance: Math.round((activity.distance / 1609.344) * 100) / 100, // Round to hundredths
    duration: formatDuration(activity.moving_time),
    pace: calculatePace(activity.distance, activity.moving_time),
    elevation: Math.round(activity.total_elevation_gain * 3.28084), // Convert meters to feet
    heartRate: activity.average_heartrate ? Math.round(activity.average_heartrate) : null,
    maxHeartRate: activity.max_heartrate ? Math.round(activity.max_heartrate) : null,
    effort: activity.perceived_exertion || calculateEffortFromPace(activity.distance, activity.moving_time),
    temperature: activity.temperature,
    humidity: activity.humidity,
    weather: formatWeather(activity.weather),
    splits: activity.splits_metric,
    kudos: activity.kudos_count,
    description: activity.description,
    isAnalyzed: false,
    coachFeedback: '',
    needsAnalysis: true,
    // Add more detailed data for the detailed view
    detailedStats: {
      averageSpeed: Math.round((activity.average_speed * 2.237) * 100) / 100, // m/s to mph
      maxSpeed: Math.round((activity.max_speed * 2.237) * 100) / 100,
      calories: activity.calories,
      sufferScore: activity.suffer_score,
      startLatlng: activity.start_latlng,
      endLatlng: activity.end_latlng,
      achievementCount: activity.achievement_count,
      prCount: activity.pr_count,
      workoutType: activity.workout_type
    }
  }))
  .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort newest first

    return NextResponse.json({ runs });
  } catch (error) {
    console.error('Strava API error:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function calculatePace(distanceMeters: number, timeSeconds: number): string {
  const miles = distanceMeters / 1609.344;
  const paceSecondsPerMile = timeSeconds / miles;
  const minutes = Math.floor(paceSecondsPerMile / 60);
  const seconds = Math.round(paceSecondsPerMile % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function calculateEffortFromPace(distanceMeters: number, timeSeconds: number): string {
  const pace = timeSeconds / (distanceMeters / 1609.344) / 60; // minutes per mile
  if (pace < 6) return 'Hard';
  if (pace < 7) return 'Medium';
  if (pace < 8.5) return 'Easy';
  return 'Recovery';
}

function formatWeather(weather: any): string {
  if (!weather) return 'Unknown';
  return `${weather.summary || 'Clear'}, ${Math.round((weather.temperature - 273.15) * 9/5 + 32)}°F`;
}
