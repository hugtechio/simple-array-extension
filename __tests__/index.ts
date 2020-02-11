import '../index'

describe('index.ts', () => {
    describe('#uniq', () => {
        it('should be make uniq (object equality)', async () => {
            const sampleArray = [{name: 'tom'}, {name: 'dan'}, {name: 'tom'}]
            const result = sampleArray.uniq()
            expect(result).toEqual([{name: 'tom'}, {name: 'dan'}])
        });

        it('should be make uniq (lazy types)', async () => {
            const sampleArray = [{name: 'tom'}, {name: 'dan'}, {name: 'tom'}]
            // @ts-ignore
            const result = sampleArray.uniq((v1, v2) => v1.name === v2.name)
            expect(result).toEqual([{name: 'tom'}, {name: 'dan'}])
        });

        it('should be make uniq (strict types)', async () => {
            interface Person { name: string }
            const sampleArray: Person[] = [{name: 'tom'}, {name: 'dan'}, {name: 'tom'}]
            const result = sampleArray.uniq<Person>((v1, v2): boolean => v1.name === v2.name)
            expect(result).toEqual([{name: 'tom'}, {name: 'dan'}])
        });
    });

    describe('#containsAll', () => {
        const testArray = ['a', 'b','c','d','e']
        const testArray2 = [{name: 'a'}, {name: 'b'} ,{name: 'c'}, {name: 'd'}, {name: 'e'}]

        it('should be true, all item contains (value equality)', async () => {
            const result = testArray.containsAll(['a','b','c'])
            expect(result).toBeTruthy()
        });

        it('should be false, one item does not contain (value equality)', async () => {
            const result = testArray.containsAll(['a','z','c'])
            expect(result).toBeFalsy()
        });

        it('should be false, all items does not contain (value equality)', async () => {
            const result = testArray.containsAll(['x','y','z'])
            expect(result).toBeFalsy()
        });

        it('should be true, all item contains (object equality)', async () => {
            const result = testArray2.containsAll([{name: 'a'}, {name: 'b'}], (v1, v2) => v1.name === v2.name)
            expect(result).toBeTruthy()
        });

        it('should be false, one item does not contain (object equality)', async () => {
            const result = testArray2.containsAll([{name: 'a'}, {name: 'z'}], (v1, v2) => v1.name === v2.name)
            expect(result).toBeFalsy()
        });

        it('should be false, all items does not contain (object equality)', async () => {
            const result = testArray2.containsAll([{name: 'y'}, {name: 'z'}], (v1, v2) => v1.name === v2.name)
            expect(result).toBeFalsy()
        });
    })

    describe('#containsAny', () => {
        const testArray = ['a', 'b','c','d','e']
        const testArray2 = [{name: 'a'}, {name: 'b'} ,{name: 'c'}, {name: 'd'}, {name: 'e'}]

        it('should be true, all item contains', async () => {
            const result = testArray.containsAny(['a','b','c'])
            expect(result).toBeTruthy()
        });

        it('should be true, one item does not contain', async () => {
            const result = testArray.containsAny(['a','z','c'])
            expect(result).toBeTruthy()
        });

        it('should be false, all items does not contain', async () => {
            const result = testArray.containsAny(['x','y','z'])
            expect(result).toBeFalsy()
        });

        it('should be true, all item contains (object equality)', async () => {
            const result = testArray2.containsAny([{name: 'a'}, {name: 'b'}], (v1, v2) => v1.name === v2.name)
            expect(result).toBeTruthy()
        });

        it('should be true, one item does not contain (object equality)', async () => {
            const result = testArray2.containsAny([{name: 'z'}, {name: 'b'}], (v1, v2) => v1.name === v2.name)
            expect(result).toBeTruthy()
        });

        it('should be false, all items does not contain (object equality)', async () => {
            const result = testArray2.containsAny([{name: 'y'}, {name: 'z'}], (v1, v2) => v1.name === v2.name)
            expect(result).toBeFalsy()
        });
    })

    describe('#selectAs', () => {
        interface Src {
            a: Dst
        }
        
        interface Dst {
            b: Dst2 
        }
        
        interface Dst2 {
            c: string;
        }
        
        const testArray: Src[] = [
            {
                a: {b: {c: 'abc'}}
            },
            {
                a: {b: {c: 'def'}}
            }
        ]

        it('should be return converted array plain object(lazy types)', async () => {
            const result = testArray.selectAs(item => item.a.b.c === 'abc')
            expect(result).toEqual(
                [
                    {a: {b: {c: 'abc'}}}
                ]
            )
        })

        it('should be return converted array plain object(strict types)', async () => {
            const result = testArray.selectAs<Src>(item => item.a.b.c === 'abc')
            expect(result).toEqual(
                [
                    {a: {b: {c: 'abc'}}}
                ]
            )
        })

        it('should be return converted array (shallow)', async () => {
            const result = testArray.selectAs<Dst>(item => item.a.b.c === 'abc', 'a')
            expect(result).toEqual(
                [
                    {b: {c: 'abc'}}
                ]
            )
        })

        it('should be return converted array (deeply)', async () => {
            const result = testArray.selectAs<Dst2>(item => item.a.b.c === 'abc', 'a.b')
            expect(result).toEqual(
                [
                    {c: 'abc'}
                ]
            )
        })

        it('should be error, prop does not exist', async () => {
            const result = testArray.selectAs<Dst2>(item => item.a.b.c === 'abc', 'error')
            expect(result).toEqual([])
        });
    })

    describe('#set', () => {
        it('should be converted to array from async iterator', async () => {
            const ait = () => {
                const ret: any = {}
                ret[Symbol.asyncIterator] = async function * () {
                    for (const item of ['1','2','3']) {
                        yield item
                    }
                    return ret
                }
                return ret
            }
            const testArray = new Array<string>()
            await testArray.set<string>(ait())
            expect(testArray).toEqual(['1','2','3'])
        }); 
    })
})