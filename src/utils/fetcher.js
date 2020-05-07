export const fetcher = endpoint => fetch(endpoint).then(response => new Promise((resolve) => {
  setTimeout(() => {
    resolve(response.json());
  }, 3000);
}));
