import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Colors, Layout } from '../constants/theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  prefix?: string;
  helperText?: string;
  errorText?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  prefix,
  helperText,
  errorText,
  containerStyle,
  icon,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputWrapper, !!errorText && styles.inputWrapperError]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <TextInput
          placeholderTextColor={Colors.textMuted}
          textAlign="right"
          style={[styles.input, style]}
          {...props}
        />
        
        {prefix && (
          <View style={styles.prefixContainer}>
            <Text style={styles.prefixText}>{prefix}</Text>
          </View>
        )}
      </View>

      {errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Layout.spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 6,
    textAlign: 'right',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    minHeight: Layout.minTouchSize,
    paddingHorizontal: Layout.spacing.md,
  },
  inputWrapperError: {
    borderColor: Colors.danger,
    backgroundColor: '#FEF2F2',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textMain,
    textAlign: 'right',
    paddingVertical: Layout.spacing.sm,
  },
  prefixContainer: {
    paddingLeft: Layout.spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    marginLeft: Layout.spacing.sm,
  },
  prefixText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
    direction: 'ltr',
  },
  iconContainer: {
    marginRight: Layout.spacing.sm,
  },
  helperText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 11,
    color: Colors.danger,
    marginTop: 4,
    textAlign: 'right',
    fontWeight: '600',
  },
});
