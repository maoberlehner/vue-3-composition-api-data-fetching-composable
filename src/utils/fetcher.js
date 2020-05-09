let count = 0;

const responses = [
  {
    company: { name: `Microsoft` },
    email: `john@microsoft.com`,
    name: `John Smith`,
    website: `https://microsoft.com/john`,
  },
  {
    company: { name: `Apple` },
    email: `john@apple.com`,
    name: `John Smith`,
    website: `https://apple.com/john`,
  },
  {
    company: { name: `Amazon` },
    email: `john@amazon.com`,
    name: `John Smith`,
    website: `https://amazon.com/john`,
  },
];

export const fetcher = endpoint => new Promise((resolve) => {
  console.log(`Fetch: ${endpoint}`);
  setTimeout(() => {
    console.log(`Respond:`, responses[count]);
    resolve(responses[count]);
    if (count === 2) {
      count = 0;
      return;
    }
    count += 1;
  }, 2000);
});
