"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const port = process.env.PORT || 3000;
const isVercel = process.env.VERCEL === '1';
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Tabebena API')
        .setDescription('The Tabebena API documentation')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    if (!isVercel) {
        await app.listen(port);
        console.log(`Application is running on: http://localhost:${port}`);
        console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
    }
    return app;
}
if (!isVercel) {
    bootstrap();
}
async function handler(req, res) {
    const app = await bootstrap();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
}
//# sourceMappingURL=main.js.map