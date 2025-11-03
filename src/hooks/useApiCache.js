import { useDispatch } from 'react-redux';
import { clearCache, clearSpecificCache } from '../redux/features/user/getAllUsersSlice';
import { 
  clearUserCache, 
  clearFinancesCache, 
  clearAllCache, 
  clearSpecificUserCache, 
  clearSpecificFinancesCache 
} from '../redux/features/user/getSIngleUserSlice';

/**
 * Custom hook for managing API cache
 * Provides utilities to clear cache when needed
 */
export const useApiCache = () => {
  const dispatch = useDispatch();

  const clearAllUsersCache = () => {
    dispatch(clearCache());
  };

  const clearSpecificUsersCache = (cacheKey) => {
    dispatch(clearSpecificCache(cacheKey));
  };

  const clearSingleUserCache = () => {
    dispatch(clearUserCache());
  };

  const clearUserFinancesCache = () => {
    dispatch(clearFinancesCache());
  };

  const clearAllUserCache = () => {
    dispatch(clearAllCache());
  };

  const clearSpecificSingleUserCache = (cacheKey) => {
    dispatch(clearSpecificUserCache(cacheKey));
  };

  const clearSpecificUserFinancesCache = (cacheKey) => {
    dispatch(clearSpecificFinancesCache(cacheKey));
  };

  // Clear all caches across the application
  const clearAllAppCache = () => {
    dispatch(clearCache()); // All users cache
    dispatch(clearAllCache()); // Single user and finances cache
  };

  return {
    // All Users Cache
    clearAllUsersCache,
    clearSpecificUsersCache,
    
    // Single User Cache
    clearSingleUserCache,
    clearUserFinancesCache,
    clearAllUserCache,
    clearSpecificSingleUserCache,
    clearSpecificUserFinancesCache,
    
    // Global Cache
    clearAllAppCache,
  };
};

/**
 * Cache configuration constants
 */
export const CACHE_CONFIG = {
  DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_ENTRIES: 100, // Maximum cache entries per slice
};

/**
 * Helper function to check if cache should be refreshed
 * @param {number} timestamp - Cache timestamp
 * @param {number} duration - Cache duration in milliseconds
 * @returns {boolean} - Whether cache is expired
 */
export const isCacheExpired = (timestamp, duration = CACHE_CONFIG.DURATION) => {
  return Date.now() - timestamp > duration;
};
