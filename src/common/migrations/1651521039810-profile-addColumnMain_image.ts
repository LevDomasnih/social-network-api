import {MigrationInterface, QueryRunner} from "typeorm";

export class profileAddColumnMainImage1651521039810 implements MigrationInterface {
    name = 'profileAddColumnMainImage1651521039810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" ADD "main_image" varchar DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "main_image"`);
    }

}
