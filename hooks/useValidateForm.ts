import { useState } from 'react';

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

const useFormValidation = (
  fields: { username?: string; email: string; password: string; role?: string },
  isRegister: boolean
) => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateForm = () => {
    const errors: ValidationErrors = {};

    if (fields.username !== undefined) {
      if (!fields.username) {
        errors.username = 'Username is required.';
      }
    }

    if (fields.email !== undefined) {
      if (!fields.email) {
        errors.email = 'Email is required.';
      } else if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
        errors.email = 'Email is invalid.';
      }
    }

    if (fields.password !== undefined) {
      if (!fields.password) {
        errors.password = 'Password is required.';
      } else if (isRegister && fields.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long.';
      }
    }

    if (fields.role !== undefined) {
      if (!fields.role) {
        errors.role = 'Role is required.';
      } else if (!['user', 'admin'].includes(fields.role)) {
        errors.role = 'Role must be "user" or "admin".';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return { validationErrors, validateForm };
};

export default useFormValidation;
