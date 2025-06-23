import React, { useState } from 'react';
import { Activity, Trophy, Calendar, TrendingUp, Target, MessageCircle, BarChart3, ChevronRight } from 'lucide-react';

const RunningCoachDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile] = useState({
    name: 'Jay',
    currentGoal: 'Marathon Training',
    weeklyMiles: 35,
    targetWeeklyMiles: 40,
    nextRace: 'Boston Marathon',
    raceDate: '2025-04-21'
  });

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
      aiAnalysis: 'Great pacing consistency! Your heart rate stayed in zone 2 for 85% of the run. Perfect for base building.',
      coachFeedback: "Excellent work, Jay! This run shows you're building a solid aerobic base. Your pacing was wonderfully consistent - exactly what we want to see in base training runs."
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
      aiAnalysis: 'Perfect long run execution. Negative split and controlled heart rate throughout.',
      coachFeedback: "This long run was textbook perfect! You showed great discipline keeping it easy, and that negative split tells me your fitness is progressing beautifully."
    }
  ]);

  const [trainingPlan] = useState({
    week: 'Week 8 of 16',
    weeklyMileage: 35,
    targetMileage: 40,
    runs: [
      { day: 'Monday', type: 'Rest', distance: 0 },
      { day: 'Tuesday', type: 'Tempo', distance: 6, description: '3x1 mile @ marathon pace' },
      { day: 'Wednesday', type: 'Easy', distance: 4, description: 'Recovery run, keep it conversational' },
      { day: 'Thursday', type: 'Intervals', distance: 7, description: '6x800m @ 5K pace' },
      { day: 'Friday', type: 'Rest', distance: 0 },
      { day: 'Saturday', type: 'Long', distance: 14, description: 'Progressive long run, last 3 miles @ marathon pace' },
      { day: 'Sunday', type: 'Easy', distance: 5, description: 'Easy shakeout run' }
    ]
  });

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'coach',
      message: "Hi Jay! I'm your AI running coach. I've analyzed your recent Strava activities and I'm excited to help you reach your Boston Marathon goal! How are you feeling about your training so far?",
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      sender: 'user',
      message: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse();
      setChatMessages(prev => [...prev, {
        sender: 'coach',
        message: aiResponse,
        timestamp: new Date()
      }]);
    }, 1000);
    
    setChatInput('');
  };

  const generateAIResponse = () => {
    const responses = [
      "That's great to hear! Based on your recent running data, you're making excellent progress. Your aerobic base is getting stronger, which is perfect for marathon training.",
      "I understand your concern. Let's look at your recent runs - your pacing has been very consistent, which is exactly what we want to see. Trust the process!",
      "Excellent question! For marathon training, 80% of your miles should be at an easy, conversational pace. Your recent runs show you're doing this well.",
      "Your dedication is paying off! I can see improvements in your heart rate efficiency and pacing consistency. Keep up the fantastic work!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {userProfile.name}! 🏃‍♂️</h1>
        <p className="text-blue-100">Your AI Running Coach is ready to help you achieve your goals!</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Weekly Mileage</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{userProfile.weeklyMiles}</div>
          <div className="text-sm text-gray-500">of {userProfile.targetWeeklyMiles} miles</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{width: `${(userProfile.weeklyMiles / userProfile.targetWeeklyMiles) * 100}%`}}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Next Race</h3>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="text-lg font-bold text-gray-900">{userProfile.nextRace}</div>
          <div className="text-sm text-gray-500">{userProfile.raceDate}</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Training Phase</h3>
            <Target className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-lg font-bold text-gray-900">{trainingPlan.week}</div>
          <div className="text-sm text-gray-500">Base Building</div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Recent Activities</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center g
