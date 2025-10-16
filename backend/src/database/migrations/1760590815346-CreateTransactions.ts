import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTransactions1760590815346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'kind',
            type: 'enum',
            enum: ['PAYABLE', 'RECEIVABLE'],
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'],
            default: "'PENDING'",
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'dueDate',
            type: 'date',
          },
          {
            name: 'paymentDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'clientId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['clientId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'clients',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('transactions');
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('clientId') !== -1);
    await queryRunner.dropForeignKey('transactions', foreignKey);
    await queryRunner.dropTable('transactions');
  }
}
