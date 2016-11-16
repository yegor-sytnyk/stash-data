import helper from './_testHelper';
import {expect} from 'chai';
import memoryProvider from '../memoryProvider';

describe('Department Repository', () => {
    before((done) => {
        let data = [
            {id: 1, text: "first", value: 7},
            {id: 2, text: "second", value: 13},
            {id: 3, text: "third", value: 24},
            {id: 4, text: "forth", value: 48},
            {id: 5, text: "fifth", value: 57},
            {id: 6, text: "sixth", value: 69},
        ];

        memoryProvider.init(data);

        done();
    });

    describe('simple AND', () => {
        it('get some results, when match', async() => {
            let results = await memoryProvider.query({
                where: {
                    value: 13,
                    text: 'second'
                }
            });

            expect(results).to.have.length(1);
            expect(results[0].text).to.be.equal('second');
        });

        it('get not results, when no match', async() => {
            let results = await memoryProvider.query({
                where: {
                    value: 13,
                    text: 'third'
                }
            });

            expect(results).to.have.length(0);
        })
    });

    describe('OR', () => {
        it('top level OR', async() => {
            let results = await memoryProvider.query({
                where: {
                    $or: {
                        value: 13,
                        text: 'first'
                    },
                }
            });

            expect(results).to.have.length(2);
        });
    });

    describe('check', () => {
        it('check operator', async() => {
            try {
                let results = await memoryProvider.query({
                    where: {
                        $someOperator: {
                            value: 13
                        },
                    }
                });
            } catch (err) {
                //TODO check error type
                return;
            }

            expect.fail();
        });
    });
});