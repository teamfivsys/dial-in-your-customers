import test from 'node:test';
import assert from 'node:assert/strict';
import { createMysqlPoolOptions } from '../server/mysql/pool.mjs';

const env = overrides => ({
  KDIAL_MYSQL_HOST: 'db.example.test',
  KDIAL_MYSQL_USER: 'test-user',
  KDIAL_MYSQL_PASSWORD: 'test-password',
  KDIAL_MYSQL_DATABASE: 'test-db',
  ...overrides,
});

test('MySQL pool requires certificate-verified TLS by default', () => {
  const options = createMysqlPoolOptions(env({}));
  assert.deepEqual(options.ssl, { rejectUnauthorized: true });
  assert.equal(options.multipleStatements, false);
});

test('TLS can be disabled for Hostinger-documented literal loopback only', () => {
  const options = createMysqlPoolOptions(env({ KDIAL_MYSQL_HOST: '127.0.0.1', KDIAL_MYSQL_TLS: 'false' }));
  assert.equal(options.ssl, undefined);
  assert.equal(options.host, '127.0.0.1');
});

test('remote MySQL cannot disable TLS, even with a local-test flag', () => {
  assert.throws(
    () => createMysqlPoolOptions(env({ KDIAL_MYSQL_TLS: 'false', KDIAL_LOCAL_TEST: 'true' })),
    /TLS can be disabled only for a loopback database connection/,
  );
});

test('TLS-disabled localhost aliases and malformed settings fail closed', () => {
  for (const host of ['localhost', 'db.example.test']) {
    assert.throws(() => createMysqlPoolOptions(env({ KDIAL_MYSQL_HOST: host, KDIAL_MYSQL_TLS: 'false' })), /loopback database connection/);
  }
  assert.throws(() => createMysqlPoolOptions(env({ KDIAL_MYSQL_TLS: 'off' })), /must be true or false/);
});
