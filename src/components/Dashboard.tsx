/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect } from 'react';
import { Activity, Trophy, Calendar, TrendingUp, Target, MessageCircle, BarChart3, Loader, X, Heart, Thermometer, Cloud, Mountain, Clock, Send, Timer } from 'lucide-react';

interface DashboardProps {
  session?: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
  };
  onSignOut?: () => void;
}

const CompleteGPT4RunningCoach = ({ session, onSignOut }: DashboardProps) => {
  const [currentStep, setCurrentStep] = useState('onboarding');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [showRunDetail, setShowRunDetail] = useState(false);
  const [runChatMessages, setRunChatMessages] = useState<any[]>([]);
  const [runChatInput, setRunChatInput] = useState('');
  
  // Onboarding state
  const [onboardingData, setOnboardingData] = useState({
    fitnessLevel: '',
    weeklyMiles: '',
    primaryGoal: '',
    raceDate: '',
    runningDays: '',
    timeAvailable: '',
    injuryHistory: '',
    previousExperience: '',
    preferredRunningTime: '',
    motivations: ''
  });

  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: session?.user?.name?.split(' ')[0] || 'Runner',
    isOnboarded: false,
    currentGoal: '',
    weeklyMiles: 0,
    targetWeeklyMiles: 0,
    nextRace: '',
    raceDate: '',
    personalizedPlan: null as any
  });

  // Training data state
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      distance: 8.2,
      duration: '42:15',
      pace: '5:09',
      date: '2025-06-23',
      route: 'Morning Loop',
      heartRate: 165,
      effort: 'Medium',
      elevation: 245,
      weather: 'Cool, 52°F',
      coachFeedback: '',
      isAnalyzed: false,
      calories: 650,
      averageSpeed: 11.6,
      maxHeartRate: 178,
      temperature: 52,
      humidity: 65,
      splits: [
        { mile: 1, time: '5:02', elevation: 15, heartRate: 160 },
        { mile: 2, time: '5:08', elevation: 25, heartRate: 165 },
        { mile: 3, time: '5:15', elevation: 35, heartRate: 170 },
        { mile: 4, time: '5:12', elevation: 20, heartRate: 168 },
        { mile: 5, time: '5:18', elevation: 30, heartRate: 172 },
        { mile: 6, time: '5:05', elevation: 18, heartRate: 164 },
        { mile: 7, time: '5:10', elevation: 28, heartRate: 167 },
        { mile: 8, time: '5:06', elevation: 22, heartRate: 162 }
      ],
      startTime: '06:30 AM',
      endTime: '07:12 AM',
      averageCadence: 174,
      totalStrides: 7344,
      hrZones: {
        zone1: { time: '8:30', percentage: 20, range: '120-140 bpm' },
        zone2: { time: '15:45', percentage: 37, range: '140-155 bpm' },
        zone3: { time: '12:30', percentage: 30, range: '155-170 bpm' },
        zone4: { time: '5:30', percentage: 13, range: '170-185 bpm' },
        zone5: { time: '0:00', percentage: 0, range: '185+ bpm' }
      }
    },
    {
      id: 2,
      distance: 12.0,
      duration: '1:05:30',
      pace: '5:27',
      date: '2025-06-21',
      route: 'Long Run Trail',
      heartRate: 158,
      effort: 'Easy',
      elevation: 890,
      weather: 'Warm, 68°F',
      coachFeedback: '',
      isAnalyzed: false,
      calories: 950,
      averageSpeed: 11.0,
      maxHeartRate: 168,
      temperature: 68,
      humidity: 72,
      splits: [
        { mile: 1, time: '5:20', elevation: 45, heartRate: 155 },
        { mile: 2, time: '5:25', elevation: 65, heartRate: 158 },
        { mile: 3, time: '5:30', elevation: 85, heartRate: 160 },
        { mile: 4, time: '5:35', elevation: 95, heartRate: 162 },
        { mile: 5, time: '5:28', elevation: 75, heartRate: 159 },
        { mile: 6, time: '5:32', elevation: 88, heartRate: 161 },
        { mile: 7, time: '5:25', elevation: 70, heartRate: 157 },
        { mile: 8, time: '5:22', elevation: 55, heartRate: 156 },
        { mile: 9, time: '5:30', elevation: 80, heartRate: 159 },
        { mile: 10, time: '5:28', elevation: 65, heartRate: 158 },
        { mile: 11, time: '5:24', elevation: 58, heartRate: 155 },
        { mile: 12, time: '5:18', elevation: 42, heartRate: 152 }
      ],
      startTime: '07:00 AM',
      endTime: '08:05 AM',
      averageCadence: 168,
      totalStrides: 11040,
      hrZones: {
        zone1: { time: '12:00', percentage: 18, range: '120-140 bpm' },
        zone2: { time: '45:30', percentage: 70, range: '140-155 bpm' },
        zone3: { time: '8:00', percentage: 12, range: '155-170 bpm' },
        zone4: { time: '0:00', percentage: 0, range: '170-185 bpm' },
        zone5: { time: '0:00', percentage: 0, range: '185+ bpm' }
      }
    }
  ]);

  const [trainingPlan, setTrainingPlan] = useState({
    week: 'Loading...',
    phase: 'Analyzing your profile...',
    runs: [] as any[],
    isGenerated: false,
    isLoading: true
  });

  // AI Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'coach',
      message: `Hi ${userProfile.name}! I'm your AI running coach powered by advanced analysis. I'm here to help you reach your running goals with personalized advice based on the latest running science. What would you like to know about your training?`,
      timestamp: new Date(),
      isTyping: false
    }
  ]);

  // Check if user has completed onboarding
  useEffect(() => {
    const savedProfile = localStorage.getItem('aicoach_profile');
    const savedOnboarding = localStorage.getItem('aicoach_onboarding');
    
    if (savedProfile && savedOnboarding) {
      setUserProfile(JSON.parse(savedProfile));
      setOnboardingData(JSON.parse(savedOnboarding));
      setCurrentStep('dashboard');
    }
  }, []);

  // Fetch Strava data
  useEffect(() => {
    const fetchStravaData = async () => {
      const accessToken = (session as any)?.accessToken;
      if (accessToken && currentStep === 'dashboard') {
        try {
          const response = await fetch(`/api/strava/activities?accessToken=${accessToken}`);
          const data = await response.json();
      
          if (data.runs) {
            setRecentActivities(data.runs);
        
            // Auto-analyze recent runs that haven't been analyzed
            const unanalyzedRuns = data.runs.filter((run: any) => !run.isAnalyzed);
            analyzeActivities(onboardingData, unanalyzedRuns);
          }
        } catch (error) {
          console.error('Failed to fetch Strava data:', error); 
        }
      }
    };
      
    fetchStravaData();
  }, [session, currentStep, onboardingData]);

  // Generate training plan when user profile is loaded
  useEffect(() => {
    const generateTrainingPlan = async () => {
      if (userProfile.isOnboarded && !trainingPlan.isGenerated && trainingPlan.isLoading) {
        try {
          const response = await fetch('/api/ai-coach/generate-plan', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              onboardingData,
              userProfile,
              currentWeek: 1
            }),
          });

          const data = await response.json();
          
          if (data.plan) {
            setTrainingPlan({
              ...data.plan,
              isGenerated: true,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Failed to generate training plan:', error);
          setTrainingPlan(prev => ({
            ...prev,
            isLoading: false,
            week: 'Week 1',
            phase: 'Base Building Phase'
          }));
        }
      }
    };

    generateTrainingPlan();
  }, [userProfile.isOnboarded, onboardingData, trainingPlan.isGenerated, trainingPlan.isLoading]);

  // Analyze activities
  const analyzeActivities = async (onboardingData: any, activities: any[]) => {
    for (const activity of activities) {
      try {
        const response = await fetch('/api/ai-coach/analyze-activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            activity,
            onboardingData,
            userProfile,
            recentActivities
          })
        });
        
        const result = await response.json();
        
        setRecentActivities(prev => prev.map(act => 
          act.id === activity.id 
            ? { 
                ...act, 
                coachFeedback: result.feedback, 
                isAnalyzed: true,
                needsPlanAdjustment: result.needsPlanAdjustment,
                heartRateWarning: result.heartRateWarning
              }
            : act
        ));
        
        if (result.needsPlanAdjustment) {
          console.log('Plan adjustment recommended based on recent performance');
        }
      } catch (error) {
        console.error('Error analyzing activity:', error);
      }
    }
  };

  // Function to open run detail modal
  const openRunDetail = (run: any) => {
    setSelectedRun(run);
    setShowRunDetail(true);
    
    const runChatKey = `run_chat_${run.id}`;
    const savedChat = localStorage.getItem(runChatKey);
    
    if (savedChat) {
      setRunChatMessages(JSON.parse(savedChat));
    } else {
      const initialMessage = {
        sender: 'coach',
        message: `Let's talk about your ${run.route} run from ${run.date}! I can see you covered ${run.distance} miles at a ${run.pace} pace. What would you like to discuss about this workout?`,
        timestamp: new Date(),
        isTyping: false
      };
      setRunChatMessages([initialMessage]);
      localStorage.setItem(runChatKey, JSON.stringify([initialMessage]));
    }
  };

  // Function to close run detail modal
  const closeRunDetail = () => {
    setShowRunDetail(false);
    setSelectedRun(null);
    setRunChatMessages([]);
    setRunChatInput('');
  };

  // Function to send message in run-specific chat
  const handleRunChatSend = async () => {
    if (!runChatInput.trim() || !selectedRun) return;
    
    const newMessage = {
      sender: 'user',
      message: runChatInput,
      timestamp: new Date(),
      isTyping: false
    };
    
    const updatedMessages = [...runChatMessages, newMessage];
    setRunChatMessages(updatedMessages);
    
    const currentInput = runChatInput;
    setRunChatInput('');
    
    const withTyping = [...updatedMessages, {
      sender: 'coach',
      message: '',
      timestamp: new Date(),
      isTyping: true
    }];
    setRunChatMessages(withTyping);
    
    try {
      const response = await fetch('/api/ai-coach/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          userProfile,
          recentActivities,
          onboardingData,
          trainingPlan,
          specificRun: selectedRun,
          context: 'run-specific-chat'
        }),
      });

      const data = await response.json();
      const aiResponse = data.response || "I'm here to help analyze this specific run! Could you tell me more?";
      
      const finalMessages = [
        ...updatedMessages,
        {
          sender: 'coach',
          message: aiResponse,
          timestamp: new Date(),
          isTyping: false
        }
      ];
      
      setRunChatMessages(finalMessages);
      
      const runChatKey = `run_chat_${selectedRun.id}`;
      localStorage.setItem(runChatKey, JSON.stringify(finalMessages));
      
    } catch (error) {
      console.error('Run chat error:', error);
      const errorMessages = [
        ...updatedMessages,
        {
          sender: 'coach',
          message: "I'm having trouble connecting right now. Please try again in a moment!",
          timestamp: new Date(),
          isTyping: false
        }
      ];
      setRunChatMessages(errorMessages);
    }
  };

  // Onboarding questions
  const onboardingQuestions = [
    {
      id: 'fitnessLevel',
      question: 'What\'s your current running fitness level?',
      type: 'select',
      options: ['Complete Beginner (Never run regularly)', 'Beginner (0-6 months)', 'Novice (6 months - 2 years)', 'Intermediate (2-5 years)', 'Advanced (5+ years)', 'Competitive/Elite']
    },
    {
      id: 'weeklyMiles',
      question: 'How many miles do you currently run per week?',
      type: 'select',
      options: ['0-5 miles', '5-15 miles', '15-25 miles', '25-35 miles', '35-50 miles', '50-70 miles', '70+ miles']
    },
    {
      id: 'primaryGoal',
      question: 'What\'s your primary running goal for the next 6-12 months?',
      type: 'select',
      options: ['Complete my first 5K', 'Improve 5K time', 'Complete my first 10K', 'Improve 10K time', 'Complete my first half marathon', 'Improve half marathon time', 'Complete my first marathon', 'Improve marathon time', 'Ultra marathon', 'General fitness and health', 'Weight loss', 'Stay injury-free']
    },
    {
      id: 'raceDate',
      question: 'Do you have a target race date? (Optional)',
      type: 'date',
      optional: true
    },
    {
      id: 'runningDays',
      question: 'How many days per week can you realistically commit to running?',
      type: 'select',
      options: ['2-3 days', '3-4 days', '4-5 days', '5-6 days', '6-7 days', 'Every day']
    },
    {
      id: 'timeAvailable',
      question: 'How much time can you typically dedicate to each run?',
      type: 'select',
      options: ['20-30 minutes', '30-45 minutes', '45-60 minutes', '60-90 minutes', '90+ minutes', 'Varies by day']
    },
    {
      id: 'injuryHistory',
      question: 'Do you have any current injuries, past injury concerns, or physical limitations?',
      type: 'textarea',
      placeholder: 'e.g., Previous knee injury, tight IT band, no injuries, etc.'
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleOnboardingNext = async () => {
    if (currentQuestion < onboardingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsLoading(true);
      
      const newProfile = {
        ...userProfile,
        isOnboarded: true,
        currentGoal: onboardingData.primaryGoal,
        weeklyMiles: parseInt(onboardingData.weeklyMiles.split('-')[0]) || 0,
        targetWeeklyMiles: parseInt(onboardingData.weeklyMiles.split('-')[1]) || 0,
        raceDate: onboardingData.raceDate
      };
      
      setUserProfile(newProfile);
      localStorage.setItem('aicoach_profile', JSON.stringify(newProfile));
      localStorage.setItem('aicoach_onboarding', JSON.stringify(onboardingData));
      
      setCurrentStep('dashboard');
      setIsLoading(false);
    }
  };

  const handleOnboardingAnswer = (value: string) => {
    const questionId = onboardingQuestions[currentQuestion].id;
    setOnboardingData(prev => ({ ...prev, [questionId]: value }));
  };

  const generateAIResponse = async (input: string) => {
    try {
      const response = await fetch('/api/ai-coach/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userProfile,
          recentActivities,
          onboardingData,
          trainingPlan
        }),
      });

      const data = await response.json();
      return data.response || "I'm here to help with your running! Could you tell me more?";
    } catch (error) {
      console.error('AI Coach error:', error);
      return "I'm having trouble connecting right now, but I'm here to help with your running goals! Could you try asking again?";
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      sender: 'user',
      message: chatInput,
      timestamp: new Date(),
      isTyping: false
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    const currentInput = chatInput;
    setChatInput('');
    
    setChatMessages(prev => [...prev, {
      sender: 'coach',
      message: '',
      timestamp: new Date(),
      isTyping: true
    }]);
    
    try {
      const aiResponse = await generateAIResponse(currentInput);
      
      setChatMessages(prev => [
        ...prev.slice(0, -1),
        {
          sender: 'coach',
          message: aiResponse,
          timestamp: new Date(),
          isTyping: false
        }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [
        ...prev.slice(0, -1),
        {
          sender: 'coach',
          message: "I'm having trouble connecting right now. Please try again in a moment!",
          timestamp: new Date(),
          isTyping: false
        }
      ]);
    }
  };

  // Heart Rate Zone Colors
  const getHRZoneColor = (zone: number): string => {
    const colors = {
      1: 'bg-gray-400',
      2: 'bg-blue-400',
      3: 'bg-green-400',
      4: 'bg-yellow-400',
      5: 'bg-red-400'
    };
    return colors[zone as keyof typeof colors] || 'bg-gray-400';
  };

  // Render HR Zone Analysis
  const renderHRZoneAnalysis = (hrZones: any) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-red-500" />
        <h3 className="font-semibold text-gray-900">Heart Rate Zone Analysis</h3>
      </div>
      <div className="space-y-3">
        {Object.entries(hrZones).map(([zone, data]: [string, any], index) => (
          <div key={zone} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-4 h-4 rounded ${getHRZoneColor(index + 1)}`}></div>
              <div className="text-sm">
                <div className="font-medium">Zone {index + 1}</div>
                <div className="text-gray-500 text-xs">{data.range}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm">{data.time}</div>
              <div className="text-gray-500 text-xs">{data.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Lap Analysis  
  const renderLapAnalysis = (splits: any[]) => {
    if (!splits || splits.length === 0) return null;
    
    const avgPace = splits.reduce((sum, split) => {
      const [min, sec] = split.time.split(':').map(Number);
      return sum + (min + sec / 60);
    }, 0) / splits.length;
    
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Timer className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">Lap Analysis</h3>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {splits.map((split, index) => {
            const [min, sec] = split.time.split(':').map(Number);
            const lapPace = min + sec / 60;
            const deviation = ((lapPace - avgPace) / avgPace) * 100;
            
            return (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <span className="font-medium">Mile {split.mile}</span>
                <div className="flex items-center gap-4">
                  <span>{split.time}</span>
                  <span className="text-xs text-gray-500">+{split.elevation}ft</span>
                  {split.heartRate && <span className="text-xs text-red-500">{split.heartRate}bpm</span>}
                  <span className={`text-xs px-2 py-1 rounded ${
                    Math.abs(deviation) < 2 ? 'bg-green-100 text-green-700' :
                    Math.abs(deviation) < 5 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Pace Consistency:</span> {
            splits.length > 0 ? 
            (splits.reduce((sum, split) => {
              const [min, sec] = split.time.split(':').map(Number);
              const lapPace = min + sec / 60;
              return sum + Math.abs(lapPace - avgPace);
            }, 0) / splits.length < 0.2 ? 'Excellent' : 
             splits.reduce((sum, split) => {
              const [min, sec] = split.time.split(':').map(Number);
              const lapPace = min + sec / 60;
              return sum + Math.abs(lapPace - avgPace);
            }, 0) / splits.length < 0.4 ? 'Good' : 'Needs Work') : 'N/A'
          }
        </div>
      </div>
    );
  };

  // Render Run Detail Modal
  const renderRunDetailModal = () => {
    if (!showRunDetail || !selectedRun) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedRun.route}</h2>
                <p className="text-blue-100">{selectedRun.date} • {selectedRun.startTime} - {selectedRun.endTime}</p>
              </div>
              <button
                onClick={closeRunDetail}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            <div className="w-2/3 p-6 overflow-y-auto border-r border-gray-200">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Distance</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{selectedRun.distance} mi</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Duration</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{selectedRun.duration}</div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-orange-800">Avg Pace</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900">{selectedRun.pace}/mi</div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800">Avg HR</span>
                  </div>
                  <div className="text-2xl font-bold text-red-900">{selectedRun.heartRate} bpm</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Max Heart Rate</div>
                  <div className="text-lg font-semibold">{selectedRun.maxHeartRate} bpm</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Calories</div>
                  <div className="text-lg font-semibold">{selectedRun.calories}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-1">
                    <Mountain className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Elevation</span>
                  </div>
                  <div className="text-lg font-semibold">{selectedRun.elevation} ft</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Avg Cadence</div>
                  <div className="text-lg font-semibold">{selectedRun.averageCadence} spm</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Weather Conditions
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-gray-600">Temperature</span>
                      </div>
                      <div className="font-semibold">{selectedRun.temperature}°F</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Humidity</div>
                      <div className="font-semibold">{selectedRun.humidity}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedRun.hrZones && renderHRZoneAnalysis(selectedRun.hrZones)}
              
              <div className="mt-6">
                {renderLapAnalysis(selectedRun.splits)}
              </div>
            </div>

            <div className="w-1/3 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Chat About This Run</h3>
                <p className="text-sm text-gray-600">Discuss this specific workout with your AI coach</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {runChatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {msg.isTyping ? (
                        <div className="flex items-center gap-2">
                          <Loader className="h-4 w-4 animate-spin" />
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        msg.message
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={runChatInput}
                    onChange={(e) => setRunChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRunChatSend()}
                    placeholder="Ask about pacing, form, effort level..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={handleRunChatSend}
                    disabled={!runChatInput.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render onboarding
  if (currentStep === 'onboarding') {
    const question = onboardingQuestions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <h2 className="text-xl font-semibold mb-2">Creating Your Personalized Training Plan</h2>
              <p className="text-gray-600">Our AI is analyzing your responses and generating a custom coaching plan just for you...</p>
            </div>
          ) : (
            <>
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
                    placeholder={question.placeholder}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
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
                  disabled={!onboardingData[question.id as keyof typeof onboardingData] && !question.optional}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === onboardingQuestions.length - 1 ? 'Generate My Plan' : 'Next'}
                </button>
              </div>
            </>
          )}
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
            <p className="text-blue-100">Your AI coach has analyzed your profile!</p>
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
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Primary Goal</h3>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="text-lg font-bold text-gray-900">{userProfile.currentGoal || 'Setting up...'}</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Training Phase</h3>
            <Target className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-lg font-bold text-gray-900">{trainingPlan.week}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Recent Activities & AI Analysis</h2>
          <p className="text-sm text-gray-600">Click on any run to view detailed metrics, HR zones, and chat with your AI coach</p>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => openRunDetail(activity)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold">{activity.route}</span>
                    <span className="text-sm text-gray-500">{activity.date}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Click for details & HR zones</span>
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
                  
                  {activity.hrZones && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">HR Zone Distribution:</div>
                      <div className="flex gap-1 h-2 rounded overflow-hidden bg-gray-200">
                        {Object.entries(activity.hrZones).map(([zone, data]: [string, any], index) => (
                          <div 
                            key={zone}
                            className={`${getHRZoneColor(index + 1)} transition-all`}
                            style={{ width: `${data.percentage}%` }}
                            title={`Zone ${index + 1}: ${data.time} (${data.percentage}%)`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r">
                    <div className="text-sm font-medium text-blue-800 mb-1">AI Coach Analysis:</div>
                    <div className="text-sm text-blue-700">
                      {activity.coachFeedback || "Great job on this run! Your pacing and effort level show good fitness development."}
                    </div>
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
          <h2 className="font-bold text-gray-900">AI-Generated Training Plan</h2>
          <p className="text-gray-600">{userProfile.currentGoal} • Personalized for your fitness level</p>
        </div>
        {trainingPlan.isLoading ? (
          <div className="p-8 text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Generating your personalized training plan...</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{trainingPlan.week}</h3>
              <p className="text-gray-600">{trainingPlan.phase}</p>
            </div>
            
            {trainingPlan.runs && trainingPlan.runs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainingPlan.runs.map((run: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{run.day}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        run.type === 'Rest' ? 'bg-gray-100 text-gray-700' :
                        run.type === 'Easy' ? 'bg-green-100 text-green-700' :
                        run.type === 'Tempo' ? 'bg-yellow-100 text-yellow-700' :
                        run.type === 'Intervals' ? 'bg-red-100 text-red-700' :
                        run.type === 'Long' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {run.type}
                      </span>
                    </div>
                    {run.distance > 0 && (
                      <div className="text-2xl font-bold text-gray-900 mb-1">{run.distance} mi</div>
                    )}
                    <p className="text-sm text-gray-600">{run.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No training plan available. Please complete your profile setup.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderAIChat = () => (
    <div className="bg-white rounded-lg border border-gray-200 h-96 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-gray-900">Chat with Your AI Coach</h2>
        <p className="text-sm text-gray-500">Powered by GPT-4 • Ask about training, nutrition, or race strategy</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              {msg.isTyping ? (
                <div className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              ) : (
                msg.message
              )}
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
            placeholder="Ask about training, nutrition, recovery, race strategy..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Powered by GPT-4</span>
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

      {renderRunDetailModal()}
    </div>
  );
};

export default CompleteGPT4RunningCoach;
