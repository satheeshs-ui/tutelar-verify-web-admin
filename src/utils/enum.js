export const RegexPattern = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_SPECIAL: /[@$!%*?&]/,
    PASSWORD_NUMBER: /[0-9]/,
    PASSWORD_UPPERCASE: /[A-Z]/,
    PASSWORD_LOWERCASE: /[a-z]/,
    NAME_REGEX: /^[A-Za-z ]+$/,
    MOBILE_REGEX: /^[0-9]{10}$/,
    PAN_REGEX: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
};

export const Number = {
    NUMBER_100: 100,
    NUMBER_250: 250,
    THOUSAND: 1000,
    THREE_THOUSAND: 3000,
    ONE_FIFTY: 150,
    TWO_FIFTY_FIVE: 255
};

export const config = {
    customerUrl: "https://verify.tutelar.io",
};
