const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateUserForm = (values) => {
  const errors = {};

  if (!values.firstName || !values.firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (values.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  } else if (values.firstName.trim().length > 50) {
    errors.firstName = 'First name must be less than 50 characters';
  }

  if (!values.lastName || !values.lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (values.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  } else if (values.lastName.trim().length > 50) {
    errors.lastName = 'Last name must be less than 50 characters';
  }

  if (!values.email || !values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.department || !values.department.trim()) {
    errors.department = 'Department is required';
  }

  return errors;
};

export const hasErrors = (errors) => Object.keys(errors).length > 0;
