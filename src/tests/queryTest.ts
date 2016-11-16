import helper from './_testHelper';
import {expect} from 'chai';
import memoryProvider from '../memoryProvider';

describe('Query Test', () => {
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

    describe('empty query', () => {
        it('returns all by default', async() => {
            let results = await memoryProvider.query({
            });

            expect(results).to.have.length(6);
        });
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

    describe('combiners', () => {
        it('OR with inner AND matching', async() => {
            let results = await memoryProvider.query({
                where: {
                    $or: {
                        $and: {
                            text: 'second',
                            value: 13
                        },
                        text: 'first'
                    },
                }
            });

            expect(results).to.have.length(2);
        });

        it('OR with inner AND NOT matching', async() => {
            let results = await memoryProvider.query({
                where: {
                    $or: {
                        $and: {
                            text: 'second',
                            value: 14
                        },
                        text: 'first'
                    },
                }
            });

            expect(results).to.have.length(1);
        });
    });

    describe('basic operators', () => {
        it('$gt operator', async() => {
            let results = await memoryProvider.query({
                where: {
                    value: {
                        $gt: 24
                    }
                }
            });

            expect(results).to.have.length(3);
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

    describe('skip/limit', () => {
        it('limit with no offset', async() => {
            let results = await memoryProvider.query({
                limit: 2
            });

            expect(results).to.have.length(2);
        });

        it('limit with no offset', async() => {
            let results = await memoryProvider.query({
                limit: 4,
                offset: 4
            });

            expect(results).to.have.length(2);
        });
    });
});