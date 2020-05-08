import { reactive, readonly, toRefs } from 'vue';
import LRU from 'lru-cache';

import { asArray } from '../utils/as-array';

const CACHE = new LRU({ max: 1024 });

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
  const cacheKey = `${JSON.stringify(parameters)}${callback.toString()}`;
  const cacheKeyDedupe = `${cacheKey}_dedupe`;
  const cachedResponse = CACHE.get(cacheKey);

  /**
   * @type SwrCacheResponse
   */
  const response = cachedResponse || reactive({
    data: null,
    error: null,
    reload: undefined,
    state: undefined,
  });

  if (!cachedResponse) CACHE.set(cacheKey, response);

  const load = async () => {
    try {
      if (CACHE.get(cacheKeyDedupe)) return;

      response.state = response.data ? STATE.revalidating : STATE.loading;
      response.data = Object.freeze(await callback(...parameters));
      response.state = STATE.idle;

      CACHE.set(cacheKeyDedupe, true, options.dedupingInterval);
    } catch (error) {
      console.error(error);
      response.error = error;
      response.state = STATE.error;
    }
  };

  response.reload = load;
  load();

  return toRefs(readonly(response));
}
