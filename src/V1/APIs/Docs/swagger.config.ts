import authRouteDoc from './auth.docs';
import orderRouteDoc from './order.docs';
const swaggerDocumentation = {
    openapi: '3.0.3',
    info: {
        title: 'shipMate',
        version: '0.0.1',
        description: 'shipMate Documentations',
    },
    servers: [
        {
            url: 'http://localhost:8000',
            description: 'Local dev',
        },
        {
            url: 'http://production',
            description: 'Production dev',
        },
    ],
    tags: [
        {
            name: 'Authentication',
            description: 'Authentication Routes',
        },
        {
            name: 'Order',
            description: 'Order Routes (Authenticated)',
        },
    ],
    paths: {
        ...authRouteDoc,
        // ...orderRouteDoc,
    },
};
export default swaggerDocumentation;
