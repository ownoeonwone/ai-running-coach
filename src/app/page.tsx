'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Activity, Calendar, MessageCircle, TrendingUp, Users } from 'lucide-react'

export default function AIRunningCoach() {
  const { data: session, status } = useSession()
  const [currentView, setCurrentView] = useState('dashboard')

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your AI Running Coach...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Activity className="text-blue-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🏃‍♂️ AI Running Coach</h1>
          <p className="text-gray-600 mb-8">
            Connect your Strava account to get personalized coaching, training plans, and AI-powered run analysis
          </p>
          <button 
            onClick={() => signIn('strava')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Activity size={20} />
            Connect with Strava
          </button>
          <p className="text-sm text-gray-500 mt-4">Your data is secure and private</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {session.user?.name?.split(' ')[0]}! 🌟</h1>
              <p className="text-blue-100">Your AI Running Coach is ready to help you achieve your goals!</p>
            </div>
            <button 
              onClick={() => signOut()}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">🚀 Your AI Running Coach is Ready!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">✅ Strava Connected</h3>
              <p className="text-blue-800">Your running data will be automatically analyzed</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 mb-2">🤖 AI Coach Ready</h3>
              <p className="text-green-800">Get personalized training plans and coaching</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <h4 className="font-semibold text-yellow-800 mb-2">🔧 Setup Complete!</h4>
            <p className="text-yellow-700 text-sm">
              Your AI Running Coach is now deployed and ready! The full interface with training plans, 
              AI chat, and activity analysis is coming in the next update.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


