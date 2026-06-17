// Central helper to extract a readable message from Axios (or other) errors.

export function getErrorMessage(err, fallback = "Something went wrong") {
  if (!err) return fallback;

  // Axios error shape: err.response.data
  const data = err?.response?.data;

  if (typeof data === "string" && data.trim()) return data;

  // Standard backend error: { message, status, error, path, timestamp, details }
  if (data && typeof data === "object") {
    if (data.message) {
      // If backend provided field-level validation errors, append the first one.
      const details = data.details;
      if (details && typeof details === "object" && !Array.isArray(details)) {
        const firstKey = Object.keys(details)[0];
        if (firstKey) {
          return `${data.message}: ${firstKey} - ${details[firstKey]}`;
        }
      }
      return String(data.message);
    }
    if (data.error) return String(data.error);
  }

  // Generic JS error
  if (err.message) return String(err.message);

  return fallback;
}
