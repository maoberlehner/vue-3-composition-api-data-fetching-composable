import { reactive, toRefs } from 'vue';
import LRU from 'lru-cache';

import { asArray } from '../utils/as-array';

export const STATE = {
  error: Symbol(`error`),
  idle: Symbol(`idle`),
  loading: Symbol(`loading`),
  revalidating: Symbol(`revalidating`),
};

const cache = new LRU({ max: 256 });

export function useSwrCache(parameter, callback) {
  const parameters = asArray(parameter);
  const cacheKey = JSON.stringify(parameters);
  const response = reactive({
    data: null,
    error: null,
    reload: undefined,
    state: undefined,
  });

  const load = async () => {
    try {
      const cachedData = cache.get(cacheKey);
      response.state = cachedData ? STATE.revalidating : STATE.loading;
      response.data = cachedData || null;
      response.data = await callback(...parameters);
      response.state = STATE.idle;

      cache.set(cacheKey, response.data);
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
