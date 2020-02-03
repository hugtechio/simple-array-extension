/* eslint no-extend-native: ["error", { "exceptions": ["Array","Object"] }] */

export {}

type comparer = <T>(v1: T, v2:T) => boolean;

declare global {
    interface Array<T> {
        uniq<T> (comparer: comparer): T[];
        contains<T> (value: T): boolean;
        nullOrEmpty (): boolean;
    }
}

Array.prototype.uniq = function<T> (comparer: comparer): T[] {
    return this.filter((value1, index1, array1): boolean => {
        const index2 = array1.findIndex((value2): boolean => comparer(value1, value2))
        return (index1 === index2)
    })
}

Array.prototype.contains = function<T> (value: T): boolean {
    return (this.indexOf(value) >= 0)
}

Array.prototype.nullOrEmpty = function (): boolean {
    return this === null || this === undefined || this.length === 0
}
