/* eslint-disable @typescript-eslint/no-explicit-any */
export const State = new Proxy({} as any, {
  get: (target, prop) => {
    return { type: 'STATE', key: prop };
  }
});
