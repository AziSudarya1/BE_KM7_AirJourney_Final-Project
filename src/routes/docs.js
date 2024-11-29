import swagger from 'swagger-ui-express';
import openapiDocument from '../docs/openAPI.json' with { type: 'json' };

export default async (appRouter) => {
  appRouter.use('/docs', swagger.serve, swagger.setup(openapiDocument));
};
