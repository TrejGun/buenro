import { MigrationFn } from "umzug";
import { Connection } from "mongoose";

export const up: MigrationFn<Connection> = async ({ context: connection }) => {
  await connection.models.PropertyModel.create({
    externalId: "123456",
    name: "test name",
  });
};

export const down: MigrationFn<Connection> = async ({ context: connection }) => {
  await connection.collections.PropertyModel.drop();
};
