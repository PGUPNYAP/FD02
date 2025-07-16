// src/api/userService.ts
export const saveUserProfile = async (userData: { uid: string; name: string; phone: string; email: string }) => {
  const response = await fetch('http://YOUR_BACKEND_URL/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to save user profile');
  }
};
