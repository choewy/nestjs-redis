import { applyDecorators } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { RedisPubParamsMetadataKey } from './enums';
import { extractRedisPubParamMetadata } from './on-redis-pub-params';
import { OnRedisContextType, OnRedisPubHandlerReturnType } from './types';
import { createRedisPubEvent } from '../constants';
import { RedisPubPayload } from '../implements';

export const OnRedisPub = (channel: string): MethodDecorator => {
  const event = createRedisPubEvent(channel);

  return applyDecorators(OnEvent(event), (target: unknown, _propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const handler = descriptor.value;
    const metadataKeys = Reflect.getOwnMetadataKeys(descriptor.value);
    const metadataValues = metadataKeys.map((key) => {
      return [key, Reflect.getMetadata(key, descriptor.value)];
    });

    descriptor.value = async function (redisPubPayload: RedisPubPayload) {
      const handlerArgs = [];

      for (const param of extractRedisPubParamMetadata(target)) {
        switch (param.metadataKey) {
          case RedisPubParamsMetadataKey.Payload:
            handlerArgs.push(redisPubPayload);
            break;
        }
      }

      const context: OnRedisContextType = {
        getClass: () => this.constructor,
        getHandler: () => handler,
      };

      const returnValue: OnRedisPubHandlerReturnType = {
        context,
        error: null,
      };

      try {
        await handler.bind(this)(...handlerArgs);
      } catch (e) {
        returnValue.error = e;
      }

      return returnValue;
    };

    metadataValues.forEach(([key, value]) => Reflect.defineMetadata(key, value, descriptor.value));
  });
};
