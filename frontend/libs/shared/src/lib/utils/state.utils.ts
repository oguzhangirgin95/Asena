export const State = new Proxy({} as any, {
  get: (target, prop) => {
    return { type: 'STATE', key: prop };
  }
});
