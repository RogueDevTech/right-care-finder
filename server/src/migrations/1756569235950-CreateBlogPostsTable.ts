import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBlogPostsTable1756569235950 implements MigrationInterface {
  name = "CreateBlogPostsTable1756569235950";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "blog_posts",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "title",
            type: "varchar",
            length: "255",
          },
          {
            name: "content",
            type: "text",
          },
          {
            name: "excerpt",
            type: "text",
            isNullable: true,
          },
          {
            name: "featuredImage",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "slug",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "status",
            type: "varchar",
            length: "50",
            default: "'draft'",
          },
          {
            name: "isActive",
            type: "boolean",
            default: true,
          },
          {
            name: "tags",
            type: "json",
            isNullable: true,
          },
          {
            name: "category",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "viewCount",
            type: "int",
            default: 0,
          },
          {
            name: "publishedAt",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
          {
            name: "createdBy",
            type: "uuid",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["createdBy"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
        indices: [
          {
            name: "IDX_BLOG_POST_SLUG",
            columnNames: ["slug"],
          },
          {
            name: "IDX_BLOG_POST_STATUS",
            columnNames: ["status"],
          },
          {
            name: "IDX_BLOG_POST_CATEGORY",
            columnNames: ["category"],
          },
          {
            name: "IDX_BLOG_POST_CREATED_BY",
            columnNames: ["createdBy"],
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("blog_posts");
  }
}
