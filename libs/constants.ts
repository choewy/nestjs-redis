export const createRedisEvent = (channel: string) => ['redis', 'sub', channel].join('.');
