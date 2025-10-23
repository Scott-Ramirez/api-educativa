import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1761188801028 implements MigrationInterface {
    name = 'InitialMigration1761188801028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`students\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`edad\` int NOT NULL, \`grado\` varchar(255) NOT NULL, \`nivel\` varchar(255) NOT NULL DEFAULT 'primaria', \`foto_url\` varchar(255) NULL, \`cloudinary_public_id\` varchar(255) NULL, \`observaciones\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL DEFAULT 'PARENT', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subjects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`descripcion\` text NULL, \`color\` varchar(255) NULL, \`icono\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`schedules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dia\` varchar(255) NOT NULL, \`hora_inicio\` varchar(255) NOT NULL, \`hora_fin\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`subjectId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`invites\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codeHash\` varchar(128) NOT NULL, \`used\` tinyint NOT NULL DEFAULT 0, \`expiresAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`studentId\` int NULL, \`createdById\` int NULL, \`usedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`grades\` (\`id\` int NOT NULL AUTO_INCREMENT, \`calificacion\` decimal(4,2) NOT NULL, \`tipo\` varchar(255) NOT NULL, \`descripcion\` varchar(255) NOT NULL, \`fecha\` varchar(255) NOT NULL, \`periodo\` varchar(255) NOT NULL, \`valor_maximo\` int NOT NULL DEFAULT '100', \`observaciones\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`studentId\` int NULL, \`subjectId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`behaviors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fecha\` varchar(255) NOT NULL, \`estado\` varchar(255) NOT NULL, \`observaciones\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`studentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tokenHash\` varchar(128) NOT NULL, \`expiresAt\` datetime NOT NULL, \`revoked\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`attendance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fecha\` varchar(255) NOT NULL, \`estado\` varchar(255) NOT NULL, \`hora_llegada\` varchar(255) NULL, \`justificacion\` text NULL, \`observaciones\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`studentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`activities\` (\`id\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(255) NOT NULL, \`descripcion\` text NULL, \`fecha\` date NOT NULL, \`nota\` float NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`studentId\` int NULL, \`subjectId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD CONSTRAINT \`FK_e0208b4f964e609959aff431bf9\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`schedules\` ADD CONSTRAINT \`FK_651f2a89f77493526bff6115412\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invites\` ADD CONSTRAINT \`FK_f8a8397ac228856c7813b0189bc\` FOREIGN KEY (\`studentId\`) REFERENCES \`students\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invites\` ADD CONSTRAINT \`FK_5443fd9ee41280475095b6157eb\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invites\` ADD CONSTRAINT \`FK_247c25f193a45f17bd403eb7379\` FOREIGN KEY (\`usedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`grades\` ADD CONSTRAINT \`FK_fcfc027e4e5fb37a4372e688070\` FOREIGN KEY (\`studentId\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`grades\` ADD CONSTRAINT \`FK_53072aa77cf53aec5463b9b3505\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`behaviors\` ADD CONSTRAINT \`FK_5a9f7995e858e7b9b5602450c14\` FOREIGN KEY (\`studentId\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_610102b60fea1455310ccd299de\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attendance\` ADD CONSTRAINT \`FK_120e1c6edcec4f8221f467c8039\` FOREIGN KEY (\`studentId\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activities\` ADD CONSTRAINT \`FK_ec90e2451d990c6bf0d3a68e9c1\` FOREIGN KEY (\`studentId\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activities\` ADD CONSTRAINT \`FK_1c4a2aadcc05cc78f426eef0cd6\` FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activities\` DROP FOREIGN KEY \`FK_1c4a2aadcc05cc78f426eef0cd6\``);
        await queryRunner.query(`ALTER TABLE \`activities\` DROP FOREIGN KEY \`FK_ec90e2451d990c6bf0d3a68e9c1\``);
        await queryRunner.query(`ALTER TABLE \`attendance\` DROP FOREIGN KEY \`FK_120e1c6edcec4f8221f467c8039\``);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_610102b60fea1455310ccd299de\``);
        await queryRunner.query(`ALTER TABLE \`behaviors\` DROP FOREIGN KEY \`FK_5a9f7995e858e7b9b5602450c14\``);
        await queryRunner.query(`ALTER TABLE \`grades\` DROP FOREIGN KEY \`FK_53072aa77cf53aec5463b9b3505\``);
        await queryRunner.query(`ALTER TABLE \`grades\` DROP FOREIGN KEY \`FK_fcfc027e4e5fb37a4372e688070\``);
        await queryRunner.query(`ALTER TABLE \`invites\` DROP FOREIGN KEY \`FK_247c25f193a45f17bd403eb7379\``);
        await queryRunner.query(`ALTER TABLE \`invites\` DROP FOREIGN KEY \`FK_5443fd9ee41280475095b6157eb\``);
        await queryRunner.query(`ALTER TABLE \`invites\` DROP FOREIGN KEY \`FK_f8a8397ac228856c7813b0189bc\``);
        await queryRunner.query(`ALTER TABLE \`schedules\` DROP FOREIGN KEY \`FK_651f2a89f77493526bff6115412\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_e0208b4f964e609959aff431bf9\``);
        await queryRunner.query(`DROP TABLE \`activities\``);
        await queryRunner.query(`DROP TABLE \`attendance\``);
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
        await queryRunner.query(`DROP TABLE \`behaviors\``);
        await queryRunner.query(`DROP TABLE \`grades\``);
        await queryRunner.query(`DROP TABLE \`invites\``);
        await queryRunner.query(`DROP TABLE \`schedules\``);
        await queryRunner.query(`DROP TABLE \`subjects\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`students\``);
    }

}
