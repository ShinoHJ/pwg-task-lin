import { useState, useCallback } from 'react';
import { ValidationErrors } from '@/type';

const useFormValidation = (
  fields: { username?: string; email: string; password: string; role?: string },
  isRegister: boolean
) => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateForm = useCallback(() => {
    const errors: ValidationErrors = {};

    if (touchedFields.has('username') && fields.username !== undefined) {
      if (!fields.username) {
        errors.username = 'Username is required.';
      }
    }

    if (touchedFields.has('email')) {
      if (!fields.email) {
        errors.email = 'Email is required.';
      } else if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
        errors.email = 'Email is invalid.';
      }
    }

    if (touchedFields.has('password')) {
      if (!fields.password) {
        errors.password = 'Password is required.';
      } else if (fields.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long.';
      }
    }

    if (touchedFields.has('role') && fields.role !== undefined) {
      if (!fields.role) {
        errors.role = 'Role is required.';
      } else if (!['user', 'admin'].includes(fields.role)) {
        errors.role = 'Role must be "user" or "admin".';
      }
    }

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