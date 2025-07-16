// src/config/googleSignin.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function configureGoogleSignin() {
  GoogleSignin.configure({
    webClientId: '624679788059-qgvsiqam36lo675a5rbgkc1qrkpmq8su.apps.googleusercontent.com', // ✅ Use your actual client ID
    offlineAccess: true,
  });
}
