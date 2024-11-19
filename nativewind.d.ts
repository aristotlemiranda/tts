// nativewind.d.ts
import 'react-native';
import { TextProps, ViewProps } from 'react-native';

declare module 'react-native' {
  interface TextProps {
    className?: string;
  }
  interface ViewProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
}
