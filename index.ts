/* eslint no-extend-native: ["error", { "exceptions": ["Array","Object"] }] */

export {}

type matcher = (value: any) => boolean;

declare global {
    interface Array<T> {
        uniq<T> (comparer?: (v1: T, v2:T) => boolean): T[];
        contains<T> (value: T): boolean;
        nullOrEmpty (): boolean;
        selectAs<R> (matcher: (value: T) => boolean, prop?: string): R[];
    }
}

Array.prototype.uniq = function<T> (comparer?: (v1:T, v2:T) => boolean): T[] {
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

Array.prototype.contains = function<T> (value: T): boolean {
    return (this.indexOf(value) >= 0)
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
