export default class ApiFeatures {
    dbQueryBulder: any;

    reqQuery: any;

    constructor(dbQueryBulder: any, reqQuery: any) {
        this.dbQueryBulder = dbQueryBulder;
        this.reqQuery = reqQuery;
    }

    filter() {
        // filtering
        const queryObj = { ...this.reqQuery };
        const excludeValues = ['limit', 'page', 'fields', 'sort'];
        excludeValues.forEach((el) => delete queryObj[el]);

        // advance filtering
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        this.dbQueryBulder
            .select('*')
            .where(JSON.parse(queryString))
            .withGraphFetched('users')
            .withGraphFetched('trips');
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
}
