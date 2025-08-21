"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const core_2 = require("@nestjs/core");
const nest_winston_1 = require("nest-winston");
const allException_filter_1 = require("./common/filter/allException.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor(new core_2.Reflector()));
    app.useGlobalFilters(new allException_filter_1.AllExceptionsFilter(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER)));
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    app.setGlobalPrefix('/api');
    await app.listen(process.env.PORT ?? 3000);
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
//# sourceMappingURL=main.js.map