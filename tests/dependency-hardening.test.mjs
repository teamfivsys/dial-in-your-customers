import {test} from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const tailwindRequire=createRequire(require.resolve('tailwindcss/package.json'));const braces=tailwindRequire('braces');
test('normal Tailwind source glob and brace expansion unchanged',()=>{assert.equal(braces.compile('./src/**/*.{js,ts,jsx,tsx}'),'./src/**/*.(js|ts|jsx|tsx)');assert.deepEqual(braces.expand('x/{a,b}/{1..2}'),['x/a/1','x/a/2','x/b/1','x/b/2']);});
for(const [open,close] of [['{','}'],['(',')']])for(const method of ['parse','compile','expand','stringify'])test(`${method} rejects deeply nested ${open} patterns before recursion`,()=>{assert.throws(()=>braces[method](open.repeat(4000)+'x'+close.repeat(4000)),error=>error instanceof SyntaxError && /safe depth/.test(error.message));});
test('escaped and quoted braces remain literal',()=>{assert.ok(braces.compile('foo/\\{literal\\}'));assert.ok(braces.compile('foo/"{literal}"'));});

test('Hostinger MySQL mode is isolated from legacy Supabase admin and analytics writes', async()=>{
  const {readFile}=await import('node:fs/promises');
  const client=await readFile(new URL('../src/lib/directoryClient.ts',import.meta.url),'utf8');
  const admin=await readFile(new URL('../src/pages/Admin.tsx',import.meta.url),'utf8');
  const analytics=await readFile(new URL('../src/lib/ab.ts',import.meta.url),'utf8');
  assert.match(client,/VITE_DIRECTORY_API_MODE === "hostinger-mysql"[\s\S]{0,100}return null/);
  assert.match(admin,/VITE_DIRECTORY_API_MODE === "hostinger-mysql"[^\n]*return <MysqlAdmin \/>/);
  assert.match(admin,/lazy\(\(\) => import\("@\/pages\/AdminSupabase"\)\)/);
  assert.match(analytics,/if \(import\.meta\.env\.VITE_DIRECTORY_API_MODE === "hostinger-mysql"\) \{[\s\S]*?return;/);
});
