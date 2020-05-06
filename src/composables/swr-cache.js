import { reactive, toRefs } from 'vue';
import LRU from 'lru-cache';

import { asArray } from '../utils/as-array';

const CACHE = new LRU({ max: 256 });

const DEFAULT_OPTIONS = {
  dedupingInterval: 2000,
};

export const STATE = {
  error: Symbol(`error`),
  idle: Symbol(`idle`),
  loading: Symbol(`loading`),
  revalidating: Symbol(`revalidating`),
};

export function useSwrCache(parameter, callback, customOptions) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...customOptions,
  };

  const parameters = asArray(parameter);
  const cacheKey = JSON.stringify(parameters);
  const cacheKeyDedupe = `${cacheKey}_dedupe`;
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
