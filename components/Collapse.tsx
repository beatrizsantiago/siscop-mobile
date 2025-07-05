import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, View } from 'react-native';
import { styled } from 'styled-components/native';

interface CollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
  duration?: number;
}

const Collapse: React.FC<CollapseProps> = ({ isOpen, children, duration = 300 }) => {
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const handleLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (height > 0 && contentHeight === 0) {
      setContentHeight(height);
      animatedHeight.setValue(isOpen ? height : 0);
    }
  };

  useEffect(() => {
    if (contentHeight === 0) return;

    Animated.timing(animatedHeight, {
      toValue: isOpen ? contentHeight : 0,
      duration,
      useNativeDriver: false,
    }).start();
  }, [isOpen, contentHeight]);

  return (
    <View>
      {contentHeight === 0 && (
        <HiddenContent onLayout={handleLayout}>
          {children}
        </HiddenContent>
      )}

      <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
        <View>{children}</View>
      </Animated.View>
    </View>
  );
};

const HiddenContent = styled.View`
  position: absolute;
  opacity: 0;
  z-index: -1;
`;

export default Collapse;
