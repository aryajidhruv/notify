// "dhruv@gmail.com" -> "dhruv"
// The backend has no name field, so we use the part before the @
export const getNameFromEmail = (email = "") => email.split("@")[0];