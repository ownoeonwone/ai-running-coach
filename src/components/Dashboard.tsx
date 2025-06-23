'use client'

import React, { useState } from 'react'
import { Activity, Trophy, Calendar, TrendingUp, Target, MessageCircle } from 'lucide-react'

export default function Dashboard() {
  const [userProfile] = useState({
    name: 'Jay',
    currentGoal: 'Marathon Training',
    weeklyMiles: 35,
    targetWeeklyMiles: 40,
    nextRace: 'Boston Marathon',
    raceDate: '2025-04-21',
  })

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'run',
      distance: 8.2,
      duration: '42:15',
      pace: '5:09',
      date: '2025-06-23',
      route: 'Morning Loop',
      heartRate: 165,
      effort: 'Medium',
      aiAnalysis: 'Great pacing consistency! Your heart rate stayed controlled throughout.',
      coachFeedback: 'Excellent work, Jay! This run shows your progress perfectly.',
    },
    {
      id: 2,
      type: 'run',
      distance: 12.0,
      duration: '1:05:30',
      pace: '5:27',
      date: '2025-06-21',
      route: 'Long Run Trail',
      heartRate: 158,
      effort: 'Easy',
      aiAnalysis: 'Perfect long run execution. Negative splits show great endurance.',
      coachFeedback: 'Textbook long run. You’re right on track for race day.',
    },
  ])

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {userProfile.name}! 🏃‍♂️</h1>
        <p>Your current goal: {userProfile.currentGoal}</p>
      </div>

      {/* Training Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><TrendingUp size={18}/> Training Summary</h2>
          <p><strong>This Week:</strong> {userProfile.weeklyMiles} mi</p>
          <p><strong>Target:</strong> {userProfile.targetWeeklyMiles} mi</p>
          <p><strong>Next Race:</strong> {userProfile.nextRace} on {userProfile.raceDate}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><Trophy size={18}/> Coach Feedback</h2>
          {recentActivities.map((activity) => (
            <div key={activity.id} className="mb-3">
              <p className="text-sm text-gray-500">{activity.date} – {activity.route}</p>
              <p className="text-green-700 text-sm">{activity.coachFeedback}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

