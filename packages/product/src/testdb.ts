import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL)

import { prisma } from "@repo/product-db"

async function testConnection() {
  try {
    console.log('🔗 Connecting to PostgreSQL (Docker)...')
    
    await prisma.$connect()
    console.log('✅ Connected successfully!')
    
    // Test query
    const result = await prisma.$queryRaw`SELECT version()`
    console.log('📊 PostgreSQL version:', result)
    
    // Check tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('📋 Tables:', tables)
    
    await prisma.$disconnect()
    console.log('✅ Test completed!')
  } catch (error) {
    console.error('❌ Connection failed:', error)
    console.error('\n💡 Troubleshooting:')
    console.error('1. Check if Docker container is running: docker ps')
    console.error('2. Check if database exists: docker exec -it <container> psql -U admin -l')
    console.error('3. Verify credentials in .env file')
    process.exit(1)
  }
}

testConnection()