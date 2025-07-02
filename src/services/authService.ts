import { supabase } from '../lib/supabase';
import { User } from '../types';

declare global {
  interface Window {
    google: any;
  }
}

export class AuthService {
  // Note: Replace with your actual Google Client ID from Google Cloud Console
  // For now, using a placeholder - you need to get this from https://console.cloud.google.com/
  private static readonly GOOGLE_CLIENT_ID = 'your-google-client-id-here.apps.googleusercontent.com';

  // Initialize Google Sign-In
  static initializeGoogleAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if Google script is loaded
      const checkGoogle = () => {
        if (window.google && window.google.accounts) {
          try {
            window.google.accounts.id.initialize({
              client_id: this.GOOGLE_CLIENT_ID,
              callback: this.handleGoogleSignIn,
              auto_select: false,
              cancel_on_tap_outside: true,
            });
            resolve();
          } catch (error) {
            console.warn('Google Sign-In initialization failed:', error);
            resolve(); // Don't block the app if Google Sign-In fails
          }
        } else {
          // Google not loaded yet, resolve anyway to not block the app
          setTimeout(() => resolve(), 1000);
        }
      };

      checkGoogle();
    });
  }

  // Handle Google Sign-In response
  private static async handleGoogleSignIn(response: any) {
    try {
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const userData = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        role: 'customer' as const
      };

      // Store user in Supabase
      await AuthService.createOrUpdateUser(userData);
      
      // Store in localStorage for the app
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Trigger a custom event to notify the app
      window.dispatchEvent(new CustomEvent('googleSignIn', { detail: userData }));
    } catch (error) {
      console.error('Error handling Google Sign-In:', error);
    }
  }

  // Create or update user in Supabase
  private static async createOrUpdateUser(userData: any) {
    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        // Update existing user
        await supabase
          .from('users')
          .update({
            name: userData.name,
            picture: userData.picture,
            last_login: new Date().toISOString()
          })
          .eq('email', userData.email);
      } else {
        // Create new user
        await supabase
          .from('users')
          .insert({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            role: userData.role,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
    }
  }

  // Render Google Sign-In button
  static renderGoogleSignInButton(elementId: string) {
    try {
      if (window.google && window.google.accounts) {
        const element = document.getElementById(elementId);
        if (element) {
          window.google.accounts.id.renderButton(element, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
          });
        }
      } else {
        // Fallback: Show a message if Google Sign-In is not available
        const element = document.getElementById(elementId);
        if (element) {
          element.innerHTML = `
            <div class="w-full p-3 border border-gray-300 rounded-lg text-center text-gray-600">
              <p class="text-sm">Google Sign-In temporarily unavailable</p>
              <p class="text-xs mt-1">Please use admin login or try again later</p>
            </div>
          `;
        }
      }
    } catch (error) {
      console.warn('Failed to render Google Sign-In button:', error);
    }
  }

  // Sign out
  static signOut() {
    try {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      console.warn('Google sign out error:', error);
    }
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('googleSignOut'));
  }
}