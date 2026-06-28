export const DEPARTMENTS = ['HR', 'IT', 'Finance', 'Marketing', 'Sales', 'Support'];

/**
 * Assigns a department to a user based on their ID (deterministic).
 */
export const assignDepartment = (id) => {
  return DEPARTMENTS[(id - 1) % DEPARTMENTS.length];
};

/**
 * Splits a full name into firstName and lastName.
 */
export const splitName = (fullName = '') => {
  const parts = fullName.trim().split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
};

/**
 * Maps raw API user to UI user shape, enriching with department and split name.
 */
export const mapApiUserToUiUser = (apiUser) => {
  const { firstName, lastName } = splitName(apiUser.name);
  return {
    id: apiUser.id,
    firstName,
    lastName,
    email: apiUser.email,
    department: apiUser.department || assignDepartment(apiUser.id),
  };
};

/**
 * Generates a temporary local ID for optimistic creates.
 */
export const generateTempId = () => Date.now();

/**
 * Debounce utility.
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Case-insensitive string includes check.
 */
export const includesCI = (str = '', search = '') =>
  str.toLowerCase().includes(search.toLowerCase());

/**
 * Returns a color for a given department chip.
 */
export const getDepartmentColor = (department) => {
  const map = {
    HR: 'error',
    IT: 'primary',
    Finance: 'success',
    Marketing: 'warning',
    Sales: 'secondary',
    Support: 'info',
  };
  return map[department] || 'default';
};
