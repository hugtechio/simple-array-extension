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
})