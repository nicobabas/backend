import { DataSource } from "typeorm";
import { entities } from "./entity";

export default new DataSource({
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: true,
  entities,
  logging: ["query", "error"],
});
