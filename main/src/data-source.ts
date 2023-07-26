import "reflect-metadata"
import { DataSource } from "typeorm"
import { Product } from "./entity/product"

export const AppDataSource = new DataSource({
    type: "mongodb",
    host: "127.0.0.1",
    port: 27017,
    database: "test",
    username: null,
    password: null,
    synchronize: true,
    logging: true,
    entities: [Product],
    migrations: [],
    subscribers: [],
}) 