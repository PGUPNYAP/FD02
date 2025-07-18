import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

interface ExpandableTextProps {
  text: string;
  numberOfLines?: number;
  textStyle?: string;
  containerStyle?: string;
}

export default function ExpandableText({ 
  text, 
  numberOfLines = 3, 
  textStyle = "text-gray-700 leading-6",
  containerStyle = "bg-gray-50 p-4 rounded-xl"
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const onTextLayout = (e: any) => {
    if (e.nativeEvent.lines.length > numberOfLines && !showReadMore) {
      setShowReadMore(true);
    }
  };

  return (
    <View className={containerStyle}>
      <Text
        className={textStyle}
        numberOfLines={isExpanded ? undefined : numberOfLines}
        onTextLayout={onTextLayout}
      >
        {text}
      </Text>
      {showReadMore && (
        <Pressable onPress={toggleExpanded} className="mt-2">
          <Text className="text-blue-600 font-medium text-sm">
            {isExpanded ? 'Show less' : 'Read more'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}