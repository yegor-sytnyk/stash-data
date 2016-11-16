import memoryProvider from './memoryProvider';
import * as _ from 'lodash';

let data = [
    {id: 1, text: "first", value: 7},
    {id: 2, text: "second", value: 13},
    {id: 3, text: "third", value: 24},
    {id: 4, text: "forth", value: 48},
    {id: 5, text: "fifth", value: 57},
    {id: 6, text: "sixth", value: 69},
];

memoryProvider.init(data);

async function query() {
    let results = await memoryProvider.query({
        where: {
            value: {
                $gt: 7
            }
        }
    });

    console.log(results);
}

query();