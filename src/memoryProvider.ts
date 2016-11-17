import * as _ from 'lodash';
import filterHelper from './core/filterHelper';
import sortHelper from './core/sortHelper';

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

    //TODO check query params should be one of (where, limit, order etc)

    if (params.where) {
        let queryFilter = filterHelper.getFilter(params.where);

        results = results.filter(x => queryFilter(x));
    }

    if (params.order) {
        sortHelper.sort(results, params.order);
    }

    if (params.limit) {
        let offset = params.offset;

        if (!offset) offset = 0;

        results = results.slice(offset, offset + params.limit);
    }

    results = results.map(x => _.cloneDeep(x));

    return Promise.resolve(results);
}