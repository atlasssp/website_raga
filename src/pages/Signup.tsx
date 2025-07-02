import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';

const Signup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Render Google Sign-In button when component mounts
    const timer = setTimeout(() => {
      AuthService.renderGoogleSignInButton('google-signup-button');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img 
              src="/images/Raga_Logo.jpg" 
              alt="RAGA BY MALLIKA" 
              className="h-16 w-auto object-contain mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us to explore our beautiful ethnic wear collection
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Google Sign-Up Button */}
          <div className="mb-6">
            <div id="google-signup-button" className="w-full"></div>
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Why Sign Up?</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• Track your orders easily</div>
              <div>• Save your favorite items</div>
              <div>• Get exclusive offers and updates</div>
              <div>• Faster checkout process</div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-amber-600 hover:text-amber-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;