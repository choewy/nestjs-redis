import { Type } from '@nestjs/common';

export type OnRedisContextType = {
  getClass(): Type<any> | null;
  getHandler(): Type<any> | null;
};

export type OnRedisPubHandlerReturnType = {
  context: OnRedisContextType;
  error: Error | null;
};

export type RedisPubParamsMetadataType<MetadataKey = string> = {
  metadataKey: MetadataKey;
  parameterIndex: number;
};
