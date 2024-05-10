import { DataSource } from "typeorm";
import { config } from 'dotenv';
import { UserEntity } from "./src/user/entities/user.entity";

config();

export default new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'users',
    entities: [UserEntity]
})

