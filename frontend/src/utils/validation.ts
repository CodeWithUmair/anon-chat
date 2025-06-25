export const validateMessage = (content: string): string | null => {
  if (content.length === 0) {
    return "Message cannot be empty";
  }
  
  if (content.length > 240) {
    return "Message must be 240 characters or less";
  }
  
  // Check for links
  const linkPatterns = [
    /https?:\/\//i,
    /www\./i,
    /\.com/i,
    /\.org/i,
    /\.net/i,
    /\.edu/i,
    /\.gov/i,
  ];
  
  for (const pattern of linkPatterns) {
    if (pattern.test(content)) {
      return "Links are not allowed in messages";
    }
  }
  
  return null;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};