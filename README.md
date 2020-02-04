# Simple array extension

This is a extension of native array in typescript.

## Install and Import

```
yarn add simple-array-extension
```

in ts file.
```
import 'simple-array-extension'
```

## exported functions (04, Feb, 2020)
```
export {};
declare type comparer = <T>(v1: T, v2: T) => boolean;
declare type matcher = (value: any) => boolean;
declare global {
    interface Array<T> {
        uniq<T>(comparer: comparer): T[];
        contains<T>(value: T): boolean;
        nullOrEmpty(): boolean;
        selectAs<R>(matcher: matcher, prop?: string): R[];
    }
}
```

## example

[See tests](https://github.com/hugtechio/simple-array-extension/blob/master/__tests__/index.ts)
