import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { S3Client, PutObjectCommand, GetObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';

console.log('====================================================');
console.log('  NEON PLATFORM SERVICES END-TO-END VERIFICATION  ');
console.log('====================================================\n');

async function testPostgres() {
  console.log('1. Testing Neon PostgreSQL Connection (Serverless HTTP Driver)...');
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing in .env.local');
  }

  const sql = neon(databaseUrl);
  const result = await sql`
    SELECT 
      version(), 
      current_database() as db_name, 
      current_user as db_user, 
      inet_server_addr() as server_ip
  `;

  console.log('   ✓ Connected successfully to Neon Postgres!');
  console.log(`   - Database: ${result[0].db_name}`);
  console.log(`   - User: ${result[0].db_user}`);
  console.log(`   - Server IP: ${result[0].server_ip}`);
  console.log(`   - Version: ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}`);

  // Test table write and read
  await sql`
    CREATE TABLE IF NOT EXISTS _neon_health_audit (
      id SERIAL PRIMARY KEY,
      service VARCHAR(50),
      tested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`INSERT INTO _neon_health_audit (service) VALUES ('neon_serverless_driver');`;
  const count = await sql`SELECT COUNT(*) FROM _neon_health_audit;`;
  console.log(`   ✓ Write & Read verified (Records in _neon_health_audit: ${count[0].count})\n`);
  return true;
}

async function testAuth() {
  console.log('2. Testing Neon Auth JWKS Endpoint...');
  const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
  const baseUrl = process.env.NEON_AUTH_BASE_URL;

  console.log(`   - Base URL: ${baseUrl}`);
  console.log(`   - JWKS URL: ${jwksUrl}`);

  if (!jwksUrl) {
    throw new Error('NEON_AUTH_JWKS_URL is missing in .env.local');
  }

  const res = await fetch(jwksUrl);
  if (!res.ok) {
    throw new Error(`Neon Auth JWKS endpoint returned HTTP ${res.status}`);
  }
  const jwks = await res.json();
  console.log(`   ✓ Neon Auth JWKS verified (Keys available: ${jwks.keys ? jwks.keys.length : 0})\n`);
  return true;
}

async function testStorage() {
  console.log('3. Testing Neon Object Storage (S3-compatible)...');
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || 'ap-southeast-1';

  console.log(`   - S3 Endpoint: ${endpoint}`);
  console.log(`   - Access Key ID: ${accessKeyId ? accessKeyId.slice(0, 12) + '...' : 'none'}`);

  const s3 = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  const bucketsRes = await s3.send(new ListBucketsCommand({}));
  const buckets = (bucketsRes.Buckets || []).map(b => b.Name);
  console.log(`   ✓ Buckets on branch: ${buckets.join(', ')}`);

  const targetBucket = buckets[0] || 'pressure-reports';
  const testKey = 'audit/neon-test-verification.json';
  const testData = JSON.stringify({
    project: 'SupeRR Selector Season 2',
    timestamp: new Date().toISOString(),
    status: 'Neon S3 Object Storage Active',
  });

  console.log(`   - Uploading test object to ${targetBucket}/${testKey}...`);
  await s3.send(new PutObjectCommand({
    Bucket: targetBucket,
    Key: testKey,
    Body: testData,
    ContentType: 'application/json',
  }));
  console.log('   ✓ PutObject succeeded!');

  const getRes = await s3.send(new GetObjectCommand({
    Bucket: targetBucket,
    Key: testKey,
  }));
  const bodyText = await getRes.Body.transformToString();
  console.log(`   ✓ GetObject verified (Body: ${bodyText})\n`);
  return true;
}

async function main() {
  try {
    await testPostgres();
    await testAuth();
    await testStorage();
    console.log('====================================================');
    console.log('  ALL NEON SERVICES TESTED AND PASSING 100%!  ');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Neon verification error:', err);
    process.exit(1);
  }
}

main();
