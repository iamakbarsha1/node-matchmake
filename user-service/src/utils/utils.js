exports.safeStringify = (obj) => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]"; // Handle circular references
      }
      seen.add(value);
    }
    return value;
  });
};
