import Joi from 'joi';
import { transpile } from 'postman2openapi';
import { writeFile } from 'fs/promises';

async function main() {
  const postmanEnvSchema = Joi.object({
    POSTMAN_API_KEY: Joi.string().required(),
    POSTMAN_COLLECTION_ID: Joi.string().required(),
    PRODUCTION_URL: Joi.string().required()
  })
    .options({ stripUnknown: true })
    .required();

  const { value: postmanEnv, error } = postmanEnvSchema.validate(process.env);

  if (error) {
    throw new Error(`Invalid environment variables: ${error.message}`);
  }

  const postmanCollectionResponse = await fetch(
    `https://api.getpostman.com/collections/${postmanEnv.POSTMAN_COLLECTION_ID}`,
    {
      headers: {
        'x-api-key': postmanEnv.POSTMAN_API_KEY
      }
    }
  );

  const { collection } = await postmanCollectionResponse.json();

  const openapi = transpile(collection);

  openapi.servers = [
    {
      url: 'http://localhost:4000',
      description: 'Local development server'
    },
    {
      url: postmanEnv.PRODUCTION_URL,
      description: 'Production server'
    }
  ];

  const stringifiedOpenapi = JSON.stringify(openapi, null, 2);

  await writeFile('./src/docs/openAPI.json', stringifiedOpenapi);
}

void main();
