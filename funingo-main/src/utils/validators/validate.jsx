export const validateEmail = (email) => {
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailPattern.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  const cleanedPhoneNumber = phoneNumber.replace(/[\s-]/g, "");
  if (cleanedPhoneNumber.startsWith("+91")) {
    return /^\+91[6-9]\d{9}$/.test(cleanedPhoneNumber);
  } else if (cleanedPhoneNumber.startsWith("0")) {
    return /^0[6-9]\d{9}$/.test(cleanedPhoneNumber);
  } else {
    return /^[6-9]\d{9}$/.test(cleanedPhoneNumber);
  }
};

export const validatePhoneNumberLength = (phoneNumber)=> {
   const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
  if (cleanedPhoneNumber.length === 10) {
    return true;
  } else {
    return false;
  }
}

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const validateAge = (ageString) => {
  const minAge = 5;
  const maxAge = 80;
  const regex = /^\d+$/;
  
  if (!regex.test(ageString)) return false;
  const age = parseInt(ageString);
  if (isNaN(age)) {
    return false;
  }

  if (age < minAge || age > maxAge) {
    return false;
  }

  return true;
};
