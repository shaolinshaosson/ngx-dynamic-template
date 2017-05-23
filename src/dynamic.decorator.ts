import { DynamicMetadataKey } from './dynamic.interface';

function buildMetadataDecorator(metadata): Function {
    return function (target: Function) {
        Reflect.set(target, DynamicMetadataKey, metadata);
        return target;
    }
}

export function DynamicLazyMetadata(metadata): Function {
    return buildMetadataDecorator(metadata);
}
