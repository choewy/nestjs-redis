export const createRedisPubEvent = (channel: string) => ['redis', 'pub', channel].join('.');
