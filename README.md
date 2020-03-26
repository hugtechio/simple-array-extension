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

## exported functions (27, Mar, 2020)
```
export {};
declare type matcher = (value: any) => boolean;
declare type comparer = (v1: any, v2: any) => boolean;
declare global {
    interface Array<T> {
        uniq<T>(comparer?: comparer): T[];
        contains<T>(value: T, comparer?: comparer): boolean;
        containsAll<T>(value: T[], comparer?: comparer): boolean;
        containsAny<T>(value: T[], comparer?: comparer): boolean;
        nullOrEmpty(): boolean;
        selectAs<R>(matcher: (value: T) => boolean, prop?: string): R[];
        set<T>(ait: AsyncIterableIterator<T>): Promise<void>;
        flatten<T>(depth?: number): T[];
        select<T>(condition: boolean): T[];
        remove<T>(condition: matcher): T[];
        clone<T>(): T[];
        first<T>(): T;
        last<T>(): T;
    }
}



```

## example

[See tests](https://github.com/hugtechio/simple-array-extension/blob/master/__tests__/index.ts)
