// src/api/authService.ts
import auth from '@react-native-firebase/auth';

export const loginUser = (email: string, password: string) => {
  return auth().signInWithEmailAndPassword(email, password);
};

export const signUpUser = (email: string, password: string) => {
  return auth().createUserWithEmailAndPassword(email, password);
};

export const logoutUser = () => {
  return auth().signOut();
};
