import { RedisPubParamsMetadataKey } from './enums';
import { RedisPubParamsMetadataType } from './types';

export const RedisPubPayloadParam = (): ParameterDecorator => (target, _propertyKey, parameterIndex) => {
  const metadataKey = RedisPubParamsMetadataKey.Payload;
  const metadataValue: RedisPubParamsMetadataType = {
    metadataKey,
    parameterIndex,
  };

  Reflect.defineMetadata(metadataKey, (Reflect.getMetadata(metadataKey, target) ?? []).concat(metadataValue), target);
};

export const extractRedisPubParamMetadata = (target: unknown) => {
  const paramsMetadatas: Array<RedisPubParamsMetadataType<RedisPubParamsMetadataKey.Payload>> = []
    .concat(Reflect.getMetadata(RedisPubParamsMetadataKey.Payload, target) ?? [])
    .sort((x, y) => x.parameterIndex - y.parameterIndex);

  return paramsMetadatas;
};
