import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAddressTable1752623974905 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_addresses",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "label",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "type",
            type: "enum",
            enum: ["home", "work", "other"],
            default: "'home'",
          },
          {
            name: "street",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "city",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "state",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "country",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "zipCode",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "apartment",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "phoneNumber",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "isDefault",
            type: "boolean",
            default: false,
          },
          {
            name: "userId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      "user_addresses",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_addresses");
  }
}
