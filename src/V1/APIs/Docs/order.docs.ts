const delivery = [
    {
        data: [
            {
                destination: 'No 3 here road',
                sender_name: 'Patrick',
                reciever_name: 'NJoli',
                sender_number: 75974958091,
                reciever_number: 75974958091,
                item: 'goods',
            },
        ],
    },
    {
        success: true,
        message: 'Delivery order created succesfully!',
        delivery: {
            userId: 1,
            item: 'goods',
            destination: 'No 3 here road',
            sender_name: 'Patrick',
            sender_number: '75974958091',
            reciever_name: 'NJoli',
            reciever_number: '75974958091',
            id: 9,
        },
    },
    {
        success: true,
        message: 'Orders found',
        count: 2,
        data: [
            {
                id: 3,
                reciever_number: '75974958091',
                item: 'goods',
                destination: 'No 3 here road',
                sender_number: '75974958091',
                reciever_name: 'NJoli',
                sender_name: 'Patrick',
                userId: 1,
                created_at: '2022-11-14T00:40:31.977Z',
                updated_at: '2022-11-14T00:40:31.977Z',
            },
            {
                id: 4,
                reciever_number: '75974958091',
                item: 'goods',
                destination: 'No 3 here road',
                sender_number: '75974958091',
                reciever_name: 'NJoli',
                sender_name: 'Patrick',
                userId: 1,
                created_at: '2022-11-14T00:42:41.026Z',
                updated_at: '2022-11-14T00:42:41.026Z',
            },
        ],
    },
    {
        message: 'please provide an authorization header to gain access',
        success: false,
    },
];

const createOrder = {
    tags: ['Order'],
    description: 'Create a Order',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        destination: {
                            type: 'string',
                            description: 'Destination item is being sent too.',
                            example:
                                'Cecilia Chapman 711-2880 Nulla St. Mankato Mississippi 96522 (257) 563-7401',
                        },
                        item: {
                            type: 'string',
                            description: 'Name of item user is sending',
                            example: 'Phone Screen',
                        },
                        sender_name: {
                            type: 'string',
                            description: 'Name of user or sender',
                            example: 'Samuel',
                        },
                        sender_number: {
                            type: 'string',
                            description: 'Phone Number of user or sender',
                            example: '08161248926',
                        },
                        reciever_number: {
                            type: 'string',
                            description: 'Phone Number of reciver',
                            example: '08161248926',
                        },
                        reciever_name: {
                            type: 'string',
                            description: 'Name of reciver of users item',
                            example: 'Omolaja',
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Ok',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: delivery[0],
                    },
                },
            },
        },

        400: {
            description: 'Bad request',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: delivery[1],
                    },
                },
            },
        },
    },
};
const getAllOrder = {
    tags: ['Order'],
    description: 'Create a Order',
    responses: {
        200: {
            description: 'Ok',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: delivery[2],
                    },
                },
            },
        },

        400: {
            description: 'Bad request',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: delivery[3],
                    },
                },
            },
        },
    },
};
const deliveryRouteDoc = {
    '/api/v1/delivery/': {
        post: {
            ...createOrder,
        },
    },
    '/api/v1/delivery/all': {
        post: {
            ...getAllOrder,
        },
    },
};

export default deliveryRouteDoc;
