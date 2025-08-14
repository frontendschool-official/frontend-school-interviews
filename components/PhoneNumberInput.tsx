import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui';

interface PhoneNumberInputProps {
  value: string;
  onChange: (phone: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showValidation?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter 10-digit phone number',
  required = false,
  disabled = false,
  className = '',
  showValidation = true,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState(false);

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return !required; // Empty is valid if not required

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Must be exactly 10 digits
    return cleaned.length === 10;
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);

    // Format as XXX-XXX-XXXX
    if (limited.length >= 6) {
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    }

    return limited;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    onChange(formatted);

    if (touched) {
      setIsValid(validatePhoneNumber(formatted));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setIsValid(validatePhoneNumber(value));
  };

  useEffect(() => {
    if (touched) {
      setIsValid(validatePhoneNumber(value));
    }
  }, [value, touched]);

  return (
    <div className={className}>
      <Input
        type='tel'
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        error={
          showValidation && touched && !isValid
            ? 'Please enter a valid 10-digit phone number'
            : undefined
        }
        helperText={
          showValidation && touched && isValid && value
            ? '✓ Valid phone number'
            : undefined
        }
      />
    </div>
  );
};

export default PhoneNumberInput;
