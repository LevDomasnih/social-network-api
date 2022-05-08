import {MigrationInterface, QueryRunner} from "typeorm";

export class profileTest1652021887972 implements MigrationInterface {
    name = 'profileTest1652021887972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" ADD "kek" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "kek"`);
    }

}
