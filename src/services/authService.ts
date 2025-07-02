import { supabase } from '../lib/supabase';
import { User } from '../types';

declare global {
  interface Window {
    google: any;
  }
}

export class AuthService {
  // Note: You need to replace this with your actual Google Client ID
  // Get it from: https://console.cloud.google.com/
  private static readonly GOOGLE_CLIENT_ID = '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com';

  // Initialize Google Sign-In
  static initializeGoogleAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: this.GOOGLE_CLIENT_ID,
          callback: this.handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        resolve();
      } else {
        // Wait for Google script to load
        const checkGoogle = setInterval(() => {
          if (window.google) {
            clearInterval(checkGoogle);
            window.google.accounts.id.initialize({
              client_id: this.GOOGLE_CLIENT_ID,
              callback: this.handleGoogleSignIn,
              auto_select: false,
              cancel_on_tap_outside: true,
            });
            resolve();
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkGoogle);
          reject(new Error('Google Sign-In failed to load'));
        }, 10000);
      }
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
    if (window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
        }
      );
    }
  }

  // Sign out
  static signOut() {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('googleSignOut'));
  }
}