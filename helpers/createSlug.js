export const createSlug = (str) => {
  // Convert the string to lowercase and replace spaces with dashes
  const slug = str.toLowerCase().replace(/\s+/g, "-");

  // Remove special characters, except for dashes and alphanumeric characters
  const cleanSlug = slug.replace(/[^a-zA-Z0-9-]/g, "");

  return cleanSlug;
};
