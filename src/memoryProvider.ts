import * as _ from 'lodash';
import queryBuilder from './queryBuilder';

export default {
    init,
    query
}

let storage = null;

function init(data) {
    storage = data;
}

function query(params) {
    let results = storage;

    if (params.where) {
        let queryFilter = queryBuilder.getQuery(params.where);

        results = results.filter(x => queryFilter(x));
    }

    results = results.map(x => _.cloneDeep(x));

    return results;
}