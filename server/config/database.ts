export const dbConfig = {
    host: process.env.DB_HOST ??'localhost',
    port: parseInt(process.env.DB_PORT?process.env.DB_PORT:'5432'),
    username: process.env.DB_USERNAME ??'postgres',
    password: process.env.DB_PASSWORD ??'',
    database: process.env.DB_DATABASE ??'ecommerce_2',
    dialect: (process.env.DB_DIALECT ?? 'postgres') as 'postgres'
  };