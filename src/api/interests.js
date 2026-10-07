import api from "./client";

// Backend rules for each interest sentence (from the InterestsRequest schema)
export const INTEREST_MIN = 5;
export const INTEREST_MAX = 200;

// Add a notice-board URL plus what the user wants to be told about
// interests: array of strings, e.g. ["tell me every time it's about job recruitments"]
// A 200 only means "queued": the backend crawls and matches in the background
export const addInterests = (sourceUrl, interests) =>
  api
    .post("/usr/add_interests", { source_url: sourceUrl, interests })
    .then((r) => r.data);

// Remove one interest by id
// WARNING: the backend endpoint is still a stub and returns a 500 error (bug 5)
export const removeInterest = (interestId) =>
  api
    .post("/usr/remove_interest", { interest_id: interestId })
    .then((r) => r.data);

// Not available yet: the backend has no endpoint to list a user's interests (bug 6).
// When it's added, it will probably look like this:
// export const listInterests = () => api.get("/usr/interests").then((r) => r.data);