//copy from https://github.com/node-fetch/timeout-signal cause the package is ESM required

export default function timeoutSignal(timeout: number) {
  if (!Number.isInteger(timeout)) {
    throw new TypeError('Expected an integer');
  }

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  // Allow Node.js processes to exit early if only the timeout is running
  timeoutId?.unref?.();

  return controller.signal;
}
