import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT) || 3606,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
};

export default dbConfig;
