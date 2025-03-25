interface FeatureFlags {
  searchAsDefault: boolean;
  // Add more feature flags here as needed
}

const getBooleanFromEnv = (key: string, defaultValue: boolean): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

export const featureFlags: FeatureFlags = {
  searchAsDefault: getBooleanFromEnv('VITE_FEATURE_SEARCH_AS_DEFAULT', false),
};