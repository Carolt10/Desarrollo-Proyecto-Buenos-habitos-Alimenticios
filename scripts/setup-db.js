const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

async function runSqlFiles() {
  const connectionString = 'postgresql://postgres:CaroAdmi123@szfyqejikjyzdcnmtjkx.supabase.co:6543/postgres'
  
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    console.log('Connected!')
  } catch (e) {
    console.log('Connection error:', JSON.stringify(e))
    process.exit(1)
  }

  const files = ['001_create_testimonios_table.sql', '002_create_content_tables.sql']
  for (const file of files) {
    console.log('Executing:', file)
    const sql = fs.readFileSync(path.join(__dirname, file), 'utf-8')
    try {
      await client.query(sql)
      console.log('SUCCESS:', file)
    } catch (e) {
      console.log('ERROR:', e.message)
    }
  }

  await client.end()
  console.log('Done!')
}

runSqlFiles()
