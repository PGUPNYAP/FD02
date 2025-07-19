import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';

interface ExpandableTextProps {
  text: string;
  numberOfLines?: number;
  textStyle?: string;
  containerStyle?: string;
}

export default function ExpandableText({
  text,
  numberOfLines = 10,
  textStyle = 'text-gray-700 leading-6',
  containerStyle = 'bg-gray-50 p-4 rounded-xl'
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);

  const hiddenTextRef = useRef<Text>(null);

  const handleTextLayout = (e: any) => {
    if (hasMeasured) return;

    const lineCount = e.nativeEvent.lines.length;
    if (lineCount > numberOfLines) {
      setShouldShowReadMore(true);
    }
    setHasMeasured(true);
  };

  return (
    <View className={containerStyle}>
      {/* Hidden text for measuring actual lines */}
      <Text
        className={`${textStyle} absolute opacity-0`}
        onTextLayout={handleTextLayout}
        numberOfLines={undefined}
      >
        {text}
      </Text>

      {/* Visible text */}
      <Text
        className={textStyle}
        numberOfLines={isExpanded ? undefined : numberOfLines}
      >
        {text}
      </Text>

      {shouldShowReadMore && (
        <Pressable onPress={() => setIsExpanded(!isExpanded)} className="mt-2">
          <Text className="text-blue-600 font-medium text-sm">
            {isExpanded ? 'Show less' : 'Read more'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
