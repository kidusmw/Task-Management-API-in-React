import { CheckSquare } from 'lucide-react';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Branding */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-12 text-white flex flex-col justify-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <CheckSquare size={40} />
                <h1 className="text-3xl font-bold">TaskFlow</h1>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Organize Your Work, Amplify Your Productivity
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Streamline your tasks, collaborate with your team, and achieve your goals with our intuitive task management platform.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span className="text-blue-100">Create and organize tasks effortlessly</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span className="text-blue-100">Track progress with visual status indicators</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span className="text-blue-100">Filter and search through your tasks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Forms */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
            {isLogin ? (
              <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
              <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;