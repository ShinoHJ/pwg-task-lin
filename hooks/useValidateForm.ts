import { useState, useCallback } from 'react';
import { ValidationErrors } from '@/type';

const useFormValidation = (
  fields: { username?: string; email: string; password: string; role?: string },
  isRegister: boolean
) => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateForm = useCallback((isSubmitting: boolean = false) => {
    const errors: ValidationErrors = {};

    const validateField = (field: string) => {
      if (isSubmitting || touchedFields.has(field)) {
        switch (field) {
          case 'username':
            if (fields.username === undefined || !fields.username.trim()) {
              errors.username = 'Username is required.';
            }
            break;
          case 'email':
            if (!fields.email.trim()) {
              errors.email = 'Email is required.';
            } else if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
              errors.email = 'Email is invalid.';
            }
            break;
          case 'password':
            if (!fields.password) {
              errors.password = 'Password is required.';
            } else if (fields.password.length < 6) {
              errors.password = 'Password must be at least 6 characters long.';
            }
            break;
          case 'role':
            if (fields.role === undefined || !fields.role) {
              errors.role = 'Role is required.';
            } else if (!['user', 'admin'].includes(fields.role)) {
              errors.role = 'Role must be "user" or "admin".';
            }
            break;
        }
      }
    };

    // 驗證所有欄位
    ['username', 'email', 'password', 'role'].forEach(validateField);

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [fields, touchedFields]);

  const handleBlur = (field: string) => {
    setTouchedFields(prev => new Set(prev).add(field));
    validateForm();
  };

  return { validationErrors, validateForm, handleBlur };
};

export default useFormValidation;