/* eslint no-extend-native: ["error", { "exceptions": ["Array","Object"] }] */

export {}

type matcher = (value: any) => boolean;
type comparer = (v1: any, v2:any) => boolean;

declare global {
    interface Array<T> {
        uniq<T> (comparer?: comparer): T[];
        contains<T> (value: T, comparer?: comparer): boolean;
        containsAll<T> (value: T[], comparer?: comparer): boolean;
        containsAny<T> (value: T[], comparer?: comparer): boolean;
        nullOrEmpty (): boolean;
        selectAs<R> (matcher: (value: T) => boolean, prop?: string): R[];
        set<T> (ait: AsyncIterableIterator<T>): Promise<void>
        flatten<T> (depth?: number): T[];
        select<T>(condition: boolean): T[];
        remove<T>(condition: matcher): T[];
        clone<T>(): T[];
        first<T>(): T;
        last<T>(): T;
    }
}

Array.prototype.uniq = function<T> (comparer?: comparer): T[] {
    // @ts-ignore
    const comp = (vv1, vv2) => {
        if (typeof vv1 === 'object' || typeof vv2 === 'object') {
            return JSON.stringify(vv1) === JSON.stringify(vv2)
        } else {
            return vv1 === vv2
        }
    }

    return this.filter((value1, index1, array1): boolean => {
        const index2 = array1.findIndex((value2): boolean => 
            (comparer) ? comparer(value1, value2) : comp(value1, value2))
        return (index1 === index2)
    })
}

Array.prototype.contains = function<T> (value: T, comparer?: comparer): boolean {
    if (comparer) {
        return (this.find(item => comparer(item, value)) !== undefined)
    } else {
        return (this.indexOf(value) >= 0)
    }
}

Array.prototype.containsAll = function<T> (value: T[], comparer? :comparer): boolean {
    let result = []
    for (let i = 0; i < value.length; i++) {
        result.push(this.contains(value[i], comparer))
    }
    return result.every(i => i)
}

Array.prototype.containsAny = function<T> (value: T[], comparer?: comparer): boolean {
    for (let i = 0; i < value.length; i++) {
        if (this.contains(value[i], comparer)) {
            return true
        }
    }
    return false
}

Array.prototype.nullOrEmpty = function (): boolean {
    return this === null || this === undefined || this.length === 0
}

Array.prototype.selectAs = function<R> (matcher: matcher, prop?: string): R[] {
    // @ts-ignore
    const getter = (item) => {
        if (!prop) {
            return item

        }
        const props = prop.split('.')

        let tmp = item
        for (let i = 0; i < props.length; i++) {
            tmp = tmp[props[i]]
        }
        return tmp
    }
    const result = this.filter(item => matcher(item)).map(item => getter(item) as R)
    return result.filter(item => item !== null && item !== undefined)
}

Array.prototype.set = async function<T> (ait: AsyncIterableIterator<T>): Promise<void> {
    let values = []
    for await (const item of ait) {
        values.push(item)
    }
    for (let i = 0; i < values.length; i++) {
        this[i] = values[i]
    }
}

Array.prototype.flatten = function<T> (depth: number = 1): T[] {
    const reducer = (acc:any, val:any) => {
        if (Array.isArray(val) && depth > 1) {
            return acc.concat(val.flatten(depth - 1))
        }
        const r = acc.concat(val)
        return r
    }
    return this.reduce(reducer, [])
}

Array.prototype.clone = function<T>(): T[] {
    return [...this]
}

Array.prototype.remove = function<T>(condition: matcher): T[] {
    const clone = [...this]
    const result = clone.reduce((previous, current, index, []) => {
        if (!condition(current)) previous.push(current)
        return previous
    })
    return result
}

Array.prototype.first = function<T>(): T {
    return this[0]
}

Array.prototype.last = function<T>(): T {
    return this[this.length - 1]
}
