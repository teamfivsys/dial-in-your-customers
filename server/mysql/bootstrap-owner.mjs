import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { getMysqlPool, closeMysqlPool } from './pool.mjs';
import { hashPassword } from './admin-api.mjs';

function readHidden(prompt) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') throw new Error('Run this command in an interactive terminal so the password is not echoed.');
  process.stdout.write(prompt);
  process.stdin.setRawMode(true); process.stdin.resume(); process.stdin.setEncoding('utf8');
  return new Promise((resolvePromise, reject) => {
    let value = '';
    const finish = result => { process.stdin.setRawMode(false); process.stdin.pause(); process.stdin.removeListener('data', onData); process.stdout.write('\n'); result(); };
    const onData = data => {
      for (const char of data) {
        if (char === '\u0003') { finish(() => reject(new Error('Cancelled.'))); return; }
        if (char === '\r' || char === '\n') { finish(() => resolvePromise(value)); return; }
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1);
        else if (char >= ' ' && char !== '\u007f') value += char;
      }
    };
    process.stdin.on('data', onData);
  });
}

export async function bootstrapOwner(email, password, pool = getMysqlPool()) {
  const normalized = String(email ?? '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || normalized.length > 254) throw new Error('Provide a valid admin email.');
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) throw new Error('Use a password between 12 and 128 characters.');
  const { salt, hash } = await hashPassword(password);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [guard] = await conn.execute('SELECT id,completed_at FROM admin_bootstrap_guard WHERE id=1 FOR UPDATE');
    const [rows] = await conn.execute('SELECT COUNT(*) AS count FROM admin_users');
    if (!guard?.length || guard[0].completed_at || Number(rows[0]?.count) !== 0) throw new Error('Initial owner has already been created.');
    const id = randomUUID();
    await conn.execute('INSERT INTO admin_users(id,email,email_normalized,password_salt,password_hash,role,active) VALUES(?,?,?,?,?,\'owner\',TRUE)', [id, normalized, normalized, salt, hash]);
    await conn.execute('UPDATE admin_bootstrap_guard SET completed_at=UTC_TIMESTAMP(3) WHERE id=1');
    await conn.execute('INSERT INTO admin_audit_events(actor_id,entity_id,action,details) VALUES(NULL,?,\'initial_owner_created\',JSON_OBJECT())', [id]);
    await conn.commit();
    return { id, email: normalized, role: 'owner' };
  } catch (error) { try { await conn.rollback(); } catch {} throw error; }
  finally { conn.release(); }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const email = process.argv[2];
    if (!email || process.argv.length !== 3) throw new Error('Usage: node server/mysql/bootstrap-owner.mjs admin@example.com');
    const first = await readHidden('Choose a password (12–128 characters): ');
    const second = await readHidden('Repeat password: ');
    if (first !== second) throw new Error('Passwords do not match.');
    const owner = await bootstrapOwner(email, first);
    process.stdout.write(`Initial owner created for ${owner.email}. Store the password securely; it cannot be recovered by this tool.\n`);
  } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
  finally { await closeMysqlPool().catch(() => {}); }
}
