import "reflect-metadata"
import { DataSource } from "typeorm"
import { Product} from "./entity/product"


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "fatsat98",
    database: "sakila",
    synchronize: true,
    logging: false,
    entities: [Product],
    migrations: [],
    subscribers: [],
})