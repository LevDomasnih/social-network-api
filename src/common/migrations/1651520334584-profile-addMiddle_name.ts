import {MigrationInterface, QueryRunner} from "typeorm";

export class profileAddMiddleName1651520334584 implements MigrationInterface {
    name = 'profileAddMiddleName1651520334584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" ADD COLUMN "middle_name" varchar DEFAULT 'Dom'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "middle_name"`);
    }

}
