import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { UserIcon } from 'react-native-heroicons/solid';

interface ProfileButtonProps {
  onPress: () => void;
  user?: {
    name: string;
    profileImage?: string | null;
  } | null; // Added | null here
}

export default function ProfileButton({ onPress, user }: ProfileButtonProps) {
  console.log("Profile button user name:", user?.name);
  
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-gray-100"
      android_ripple={{ color: '#f3f4f6', borderless: true }}
    >
      <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center mr-2">
        {user?.profileImage ? (
          <Image
            source={{ uri: user.profileImage }}
            className="w-8 h-8 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <UserIcon size={16} color="white" />
        )}
      </View>
      <Text className="text-sm font-medium text-gray-800" numberOfLines={1}>
        {user?.name || 'Profile'}
      </Text>
    </Pressable>
  );
}


// import React from 'react';
// import { View, Text, Pressable, Image } from 'react-native';
// import { UserIcon } from 'react-native-heroicons/solid';

// interface ProfileButtonProps {
//   onPress: () => void;
//   user?: {
//     name: string;
//     profileImage?: string | null;
//   };
// }

// export default function ProfileButton({ onPress, user }: ProfileButtonProps) {

//   console.log("Profile button user name : ",user?.name);
//   return (
//     <Pressable
//       onPress={onPress}
//       className="flex-row items-center bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-gray-100"
//       android_ripple={{ color: '#f3f4f6', borderless: true }}
//     >
//       <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center mr-2">
//         {user?.profileImage ? (
//           <Image
//             source={{ uri: user.profileImage }}
//             className="w-8 h-8 rounded-full"
//             resizeMode="cover"
//           />
//         ) : (
//           <UserIcon size={16} color="white" />
//         )}
//       </View>
//       <Text className="text-sm font-medium text-gray-800" numberOfLines={1}>
//         {user?.name || 'Profile'}
//       </Text>
//     </Pressable>
//   );
// }