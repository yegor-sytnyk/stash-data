import helper from './_testHelper';
import {expect} from 'chai';
import memoryProvider from '../memoryProvider';

describe('Order Test', () => {
    before((done) => {
        let data = [
            {id: 1, text: "xx", value: 17},
            {id: 2, text: "xx", value: 13},
            {id: 3, text: "ab", value: 24},
            {id: 4, text: "zz", value: 48},
            {id: 5, text: "aa", value: 69},
            {id: 6, text: "xx", value: 57},
        ];

        memoryProvider.init(data);

        done();
    });

    describe('simple order', () => {
        it('by num field ASC', async() => {
            let results = await memoryProvider.query({
                order: [
                    ['value', 'ASC']
                ]
            });

            expect(results).to.have.length(6);
            expect(results[0].value).to.be.equal(13);
            expect(results[5].value).to.be.equal(69);
        });

        it('by num field DESC', async() => {
            let results = await memoryProvider.query({
                order: [
                    ['value', 'DESC']
                ]
            });

            expect(results).to.have.length(6);
            expect(results[1].value).to.be.equal(57);
            expect(results[5].value).to.be.equal(13);
        });
    });

    describe('multiple params order', () => {
        it('by num field ASC', async() => {
            let results = await memoryProvider.query({
                order: [
                    ['text', 'ASC'],
                    ['value', 'DESC']
                ]
            });

            expect(results).to.have.length(6);
            expect(results[2].value).to.be.equal(57);
        });
    });

});