import { app } from 'electron'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import Database from 'better-sqlite3'

let database: Database.Database | null = null

function getDatabasePath() {
  const userDataPath = app.getPath('userData')
  const dataDir = join(userDataPath, 'data')

  mkdirSync(dataDir, { recursive: true })

  return join(dataDir, 'app.db')
}

export function getDatabase(): Database.Database {
  if (database) {
    return database
  }

  database = new Database(getDatabasePath())
  database.pragma('journal_mode = WAL')
  database.pragma('foreign_keys = ON')

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  `)

  return database
}

export function closeDatabase(): void {
  database?.close()
  database = null
}
