import mysql from 'mysql2/promise';

let pool;

function required(env, name) {
  const value = env[name];
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`Missing ${name}`);
  return value.trim();
}

export function createMysqlPoolOptions(env = process.env) {
  const host = required(env, 'KDIAL_MYSQL_HOST');
  const user = required(env, 'KDIAL_MYSQL_USER');
  const password = required(env, 'KDIAL_MYSQL_PASSWORD');
  const database = required(env, 'KDIAL_MYSQL_DATABASE');
  const port = Number(env.KDIAL_MYSQL_PORT || 3306);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid KDIAL_MYSQL_PORT');

  const tlsMode = env.KDIAL_MYSQL_TLS ?? 'true';
  if (tlsMode !== 'true' && tlsMode !== 'false') throw new Error('KDIAL_MYSQL_TLS must be true or false');
  const isLoopback = host === '127.0.0.1' || host === '::1';
  if (tlsMode === 'false' && !isLoopback) {
    throw new Error('MySQL TLS can be disabled only for a loopback database connection');
  }

  return {
    host, port, user, password, database,
    waitForConnections: true,
    connectTimeout: 8_000,
    connectionLimit: 8,
    maxIdle: 4,
    idleTimeout: 60_000,
    queueLimit: 32,
    enableKeepAlive: true,
    ssl: tlsMode === 'false' ? undefined : { rejectUnauthorized: true },
    charset: 'utf8mb4',
    timezone: '+05:30',
    decimalNumbers: true,
    multipleStatements: false,
  };
}

export function getMysqlPool(env = process.env) {
  if (pool) return pool;
  pool = mysql.createPool(createMysqlPoolOptions(env));
  return pool;
}

export async function closeMysqlPool() {
  if (!pool) return;
  const current = pool;
  pool = undefined;
  await current.end();
}
