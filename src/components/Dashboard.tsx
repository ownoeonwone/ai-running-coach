/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect } from 'react';
import { Activity, Trophy, Calendar, TrendingUp, Target, MessageCircle, BarChart3, ChevronRight } from 'lucide-react';

interface DashboardProps {
  session?: any;
  onSignOut?: () => void;
}

const CompleteRunningCoach = ({ session, onSignOut }: DashboardProps) => {
  const [currentStep, setCurrentStep] = useState('onboarding');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Onboarding state
  const [onboardingData, setOnboardingData] = useState({
    fitnessLevel: '',
    weeklyMiles: '',
    primaryGoal: '',
    raceDate: '',
    runningDays: '',
    timeAvailable: '',
    injuryHistory: ''
  });

  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: session?.user?.name?.split(' ')[0] || 'Runner',
    isOnboarded: false,
    currentGoal: 'Marathon Training',
    weeklyMiles: 35,
    targetWeeklyMiles: 40,
    nextRace: 'Boston Marathon',
    raceDate: '2025-04-21'
  });

  // Check if user has completed onboarding
  useEffect(() => {
    const isOnboarded = localStorage.getItem('aicoach_onboarded');
    if (isOnboarded) {
      setCurrentStep('dashboard');
      setUserProfile(prev => ({ ...prev, isOnboarded: true }));
    }
  }, []);

  // Mock training data
  const [recentActivities] = useState([
    {
      id: 1,
      distance: 8.2,
      duration: '42:15',
      pace: '5:09',
      date: '2025-06-23',
      route: 'Morning Loop',
      heartRate: 165,
      coachFeedback: "Excellent work! This run shows you're building a solid aerobic base. Your pacing was wonderfully consistent - exactly what we want to see in base training runs."
    },
    {
      id: 2,
      distance: 12.0,
      duration: '1:05:30',
      pace: '5:27',
      date: '2025-06-21',
      route: 'Long Run Trail',
      heartRate: 158,
      coachFeedback: "This long run was textbook perfect! You showed great discipline keeping it easy, and that negative split tells me your fitness is progressing beautifully."
    }
  ]);

  const [trainingPlan] = useState({
    week: 'Week 8 of 16',
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

  // AI Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'coach',
      message: `Hi ${userProfile.name}! I'm your AI running coach. I've analyzed your recent Strava activities and I'm excited to help you reach your goals! How are you feeling about your training so far?`,
      timestamp: new Date()
    }
  ]);

  // Onboarding questions
  const onboardingQuestions = [
    {
      id: 'fitnessLevel',
      question: 'What\'s your current fitness level?',
      type: 'select',
      options: ['Beginner (0-1 year)', 'Intermediate (1-3 years)', 'Advanced (3-5 years)', 'Elite (5+ years)']
    },
    {
      id: 'weeklyMiles',
      question: 'How many miles do you currently run per week?',
      type: 'select',
      options: ['0-10 miles', '10-20 miles', '20-30 miles', '30-40 miles', '40-50 miles', '50+ miles']
    },
    {
      id: 'primaryGoal',
      question: 'What\'s your primary running goal?',
      type: 'select',
      options: ['5K', '10K', 'Half Marathon', 'Marathon', 'Ultra Marathon', 'General Fitness', 'Weight Loss']
    },
    {
      id: 'raceDate',
      question: 'When is your target race? (if applicable)',
      type: 'date'
    },
    {
      id: 'runningDays',
      question: 'How many days per week can you run?',
      type: 'select',
      options: ['3 days', '4 days', '5 days', '6 days', '7 days']
    },
    {
      id: 'timeAvailable',
      question: 'How much time can you dedicate to running each day?',
      type: 'select',
      options: ['30 minutes', '45 minutes', '1 hour', '1.5 hours', '2+ hours']
    },
    {
      id: 'injuryHistory',
      question: 'Do you have any injury history or concerns?',
      type: 'textarea'
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleOnboardingNext = () => {
    if (currentQuestion < onboardingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      localStorage.setItem('aicoach_onboarded', 'true');
      setCurrentStep('dashboard');
      setUserProfile(prev => ({ ...prev, isOnboarded: true }));
    }
  };

  const handleOnboardingAnswer = (value: string) => {
    const questionId = onboardingQuestions[currentQuestion].id;
    setOnboardingData(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      sender: 'user',
      message: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, newMessage]);
    
    setTimeout(() => {
      const aiResponse = generateAIResponse(chatInput);
      setChatMessages(prev => [...prev, {
        sender: 'coach',
        message: aiResponse,
        timestamp: new Date()
      }]);
    }, 1000);
    
    setChatInput('');
  };

const generateAIResponse = async () => {
    const responses = [
      "That's excellent! Based on your recent running data, you're making great progress. Your aerobic base is getting stronger, which is perfect for marathon training. Keep focusing on easy runs at a conversational pace.",
      "I understand your concern. Looking at your recent runs, your pacing has been very consistent, which is exactly what we want to see. Trust the process - consistency trumps intensity every time!",
      "Great question! For marathon training, about 80% of your miles should be at an easy, conversational pace. Your heart rate should be in Zone 2. Your recent runs show you're nailing this!",
      "Your dedication is really paying off! I can see improvements in your heart rate efficiency and pacing consistency. The key is to stay patient - fitness gains happen gradually but they're building every day.",
      "Absolutely! Recovery is just as important as the hard work. Make sure you're getting enough sleep, staying hydrated, and listening to your body. If you're feeling overly fatigued, don't hesitate to take an extra easy day."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Render onboarding
  if (currentStep === 'onboarding') {
    const question = onboardingQuestions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">🏃‍♂️ AI Running Coach</h1>
              <span className="text-sm text-gray-500">{currentQuestion + 1} of {onboardingQuestions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{width: `${((currentQuestion + 1) / onboardingQuestions.length) * 100}%`}}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h2>
            
            {question.type === 'select' && (
              <div className="space-y-2">
                {question.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOnboardingAnswer(option)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      onboardingData[question.id as keyof typeof onboardingData] === option
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'date' && (
              <input
                type="date"
                onChange={(e) => handleOnboardingAnswer(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            {question.type === 'textarea' && (
              <textarea
                onChange={(e) => handleOnboardingAnswer(e.target.value)}
                placeholder="Tell us about any injuries or concerns..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              />
            )}
          </div>

          <div className="flex gap-3">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleOnboardingNext}
              disabled={!onboardingData[question.id as keyof typeof onboardingData]}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === onboardingQuestions.length - 1 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render main dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {userProfile.name}! 🏃‍♂️</h1>
            <p className="text-blue-100">Your AI Running Coach is ready to help you achieve your goals!</p>
          </div>
          <button 
            onClick={onSignOut}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

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

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Recent Activities</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold">{activity.route}</span>
                    <span className="text-sm text-gray-500">{activity.date}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <div className="text-gray-500">Distance</div>
                      <div className="font-semibold">{activity.distance} mi</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Time</div>
                      <div className="font-semibold">{activity.duration}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Pace</div>
                      <div className="font-semibold">{activity.pace}/mi</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Avg HR</div>
                      <div className="font-semibold">{activity.heartRate} bpm</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r">
                    <div className="text-sm font-medium text-blue-800 mb-1">Coach Analysis:</div>
                    <div className="text-sm text-blue-700">{activity.coachFeedback}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTrainingPlan = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Training Plan - {trainingPlan.week}</h2>
          <p className="text-gray-600">Marathon Training • Based on your onboarding responses</p>
        </div>
        <div className="divide-y divide-gray-200">
          {trainingPlan.runs.map((run, index) => (
            <div key={index} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-gray-900">{run.day}</div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    run.type === 'Rest' ? 'bg-gray-100 text-gray-600' :
                    run.type === 'Easy' ? 'bg-green-100 text-green-700' :
                    run.type === 'Long' ? 'bg-blue-100 text-blue-700' :
                    run.type === 'Tempo' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {run.type}
                  </div>
                  {run.distance > 0 && (
                    <div className="text-gray-600">{run.distance} miles</div>
                  )}
                </div>
                {run.description && (
                  <div className="text-sm text-gray-500 mt-1">{run.description}</div>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAIChat = () => (
    <div className="bg-white rounded-lg border border-gray-200 h-96 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-gray-900">Chat with Your AI Coach</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask your coach anything..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-900">AI Running Coach</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                {userProfile.name[0]}
              </div>
              <span className="font-medium text-gray-700">{userProfile.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { key: 'training', label: 'Training Plan', icon: Calendar },
            { key: 'chat', label: 'AI Coach', icon: MessageCircle }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'training' && renderTrainingPlan()}
        {activeTab === 'chat' && renderAIChat()}
      </div>
    </div>
  );
};

export default CompleteRunningCoach;
