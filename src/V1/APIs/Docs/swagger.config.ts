import authRouteDoc from './auth.docs';
import orderRouteDoc from './order.docs';
const swaggerDocumentation = {
    openapi: '3.0.3',
    info: {
        title: 'ShipMate',
        version: '0.0.1',
        description: 'ShipMate Documentations',
    },
    servers: [
        {
            url: 'http://localhost:8000',
            description: 'Local dev',
        },
        {
            url: 'https://shipmate-7h6p.onrender.com',
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
