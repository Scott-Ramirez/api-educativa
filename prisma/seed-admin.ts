import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import * as path from 'path';
config();

// DataSource configurado para modo desarrollo: sincroniza entidades y crea tablas si faltan.
// IMPORTANTE: synchronize: true solo para desarrollo.
const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'educativa_db',
  entities: [path.join(__dirname, '..', 'src', 'modules', '**', 'entities', '*.{ts,js}')],
  synchronize: true,
});

async function main() {
  await dataSource.initialize();
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin1234';
  const name = process.env.ADMIN_NAME || 'Administrador';

  const rows: any[] = await dataSource.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
  if (rows && rows.length > 0) {
    console.log('Admin ya existe, id=', rows[0].id);
  } else {
    const hashed = await bcrypt.hash(password, 10);
    await dataSource.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, 'ADMIN']);
    console.log('Admin creado:', { email, name });
  }

  await dataSource.destroy();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
