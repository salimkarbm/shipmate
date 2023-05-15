const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Delivery Order Manager API',
            description: 'For Delivery Management',
            contact: {
                name: 'shipMate',
            },
            servers: ['http://localhost:3000'],
        },
    },
    apis: ['../Routes/delivery/deliveryRoute/*.ts'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default swaggerOptions;
