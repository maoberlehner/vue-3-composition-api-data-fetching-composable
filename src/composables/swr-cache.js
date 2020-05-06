import { reactive, toRefs } from 'vue';
import LRU from 'lru-cache';

import { asArray } from '../utils/as-array';

const CACHE = new LRU({ max: 256 });

/**
 * @typedef {Object} SwrCacheOptions
 * @property {number} dedupingInterval Dedupe calls with the same signature in this time span in ms.
 */

/**
 * @typedef {Object} SwrCacheResponse
 * @property {any} data The (resolved) return value of the callback.
 * @property {Error} error Error thrown by the callback.
 * @property {Function} reload Function to manually call the callback function again.
 * @property {Symbol} state Current state in the lifecycle.
 */

/**
 * @type SwrCacheOptions
 */
const DEFAULT_OPTIONS = {
  dedupingInterval: 2000,
};

export const STATE = {
  error: Symbol(`error`),
  idle: Symbol(`idle`),
  loading: Symbol(`loading`),
  revalidating: Symbol(`revalidating`),
};

/**
 * A composable for caching expensive work (like data fetching) using the
 * stale-while-revalidate invalidation strategy.
 * @param {any} parameter A single parameter or an array of parameters to be passed to the callback.
 * @param {Function} callback A callback function which typically returns a promise.
 * @param {SwrCacheOptions} [customOptions] Custom configuration options.
 */
export function useSwrCache(parameter, callback, customOptions) {
  /**
   * @type SwrCacheOptions
   */
  const options = {
    ...DEFAULT_OPTIONS,
    ...customOptions,
  };

  const parameters = asArray(parameter);
  const cacheKey = JSON.stringify(parameters);
  const cacheKeyDedupe = `${cacheKey}_dedupe`;

  /**
   * @type SwrCacheResponse
   */
  const response = reactive({
    data: null,
    error: null,
    reload: undefined,
    state: undefined,
  });

  const load = async () => {
    try {
      const cachedData = CACHE.get(cacheKey) || null;
      const dedupe = CACHE.get(cacheKeyDedupe) || false;

      response.state = cachedData ? STATE.revalidating : STATE.loading;
      response.data = await cachedData;

      if (dedupe) {
        response.state = STATE.idle;
        return;
      }

      const promise = callback(...parameters);
      CACHE.set(cacheKey, promise);
      CACHE.set(cacheKeyDedupe, true, options.dedupingInterval);

      response.data = await promise;
      response.state = STATE.idle;
    } catch (error) {
      console.error(error);
      response.error = error;
      response.state = STATE.error;
    }
  };

  response.reload = load;
  load();

  return toRefs(response);
}
