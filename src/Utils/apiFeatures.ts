export default class ApiFeatures {
    private dbQueryBulder: any;

    private reqQuery: any;

    constructor(dbQueryBulder: any, reqQuery: any) {
        this.dbQueryBulder = dbQueryBulder;
        this.reqQuery = reqQuery;
    }

    filter(model: string | [string]) {
        // filtering
        const queryObj = { ...this.reqQuery };
        const excludeValues = ['limit', 'page', 'fields', 'sort'];
        excludeValues.forEach((el) => delete queryObj[el]);
        this.dbQueryBulder.select('*').where(queryObj).withGraphFetched(model);
        return this;
    }

    paginate() {
        // pagination
        const page = parseInt(this.reqQuery.page, 10) || 1;
        const limit = parseInt(this.reqQuery.limit, 10) || 100;
        const skip = (page - 1) * limit;

        this.dbQueryBulder = this.dbQueryBulder.offset(skip).limit(limit);
        return this;
    }

    // sorting
    sort() {
        if (this.reqQuery.sort) {
            const sortBy = this.reqQuery.sort.split(',').join(' ');
            this.dbQueryBulder = this.dbQueryBulder.orderBy(sortBy, 'desc');
        } else {
            this.dbQueryBulder = this.dbQueryBulder.orderBy('createdAt');
        }
        return this;
    }

    limit() {
        // field limiting or projecting
        if (this.reqQuery.fields) {
            const fields = this.reqQuery.fields.split(',').join(' ');
            this.dbQueryBulder = this.dbQueryBulder.select(fields);
        } else {
            this.dbQueryBulder = this.dbQueryBulder.select('*');
        }
        return this;
    }

    get dbQuery() {
        return this.dbQueryBulder;
    }
}
