import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { SessionUser } from './store'
import { getDatabase } from './database'
import { getSession, setSession } from './store'

type DbUser = {
  id: number
  username: string
  email: string | null
  password_hash: string
  salt: string
  created_at: string
}

export type AuthPayload = {
  username?: string
  password?: string
  email?: string | null
}

function normalizeEmail(email?: string | null) {
  const normalized = (email ?? '').trim().toLowerCase()
  return normalized === '' ? null : normalized
}

function normalizeUsername(username?: string) {
  return (username ?? '').trim()
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password: string) {
  return password.trim().length >= 6
}

function formatSessionUser(user: Pick<DbUser, 'id' | 'username' | 'email' | 'created_at'>): SessionUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.created_at
  }
}

function hashPassword(password: string, salt?: string) {
  const passwordSalt = salt ?? randomBytes(16).toString('hex')
  const passwordHash = scryptSync(password, passwordSalt, 64).toString('hex')

  return {
    salt: passwordSalt,
    passwordHash
  }
}

export function getCurrentSession() {
  return getSession()
}

export function logout() {
  return setSession(null)
}

export function register(payload: AuthPayload) {
  if (!payload) {
    throw new Error(AuthError.InvalidRegisterPayload)
  }

  const database = getDatabase()
  const email = normalizeEmail(payload.email)
  const username = normalizeUsername(payload.username)
  const password = payload.password ?? ''

  if (!username || username.length < 2) {
    throw new Error(AuthError.UsernameTooShort)
  }

  if (email && !validateEmail(email)) {
    throw new Error(AuthError.EmailInvalid)
  }

  if (!validatePassword(password)) {
    throw new Error(AuthError.PasswordTooShort)
  }

  const exists = email
    ? (database
        .prepare('SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1')
        .get(email, username) as { id: number } | undefined)
    : (database
        .prepare('SELECT id FROM users WHERE username = ? LIMIT 1')
        .get(username) as { id: number } | undefined)

  if (exists) {
    throw new Error(AuthError.UserExists)
  }

  const { salt, passwordHash } = hashPassword(password)
  const insert = database.prepare(
    'INSERT INTO users (username, email, password_hash, salt) VALUES (?, ?, ?, ?)'
  )

  const result = insert.run(username, email, passwordHash, salt)
  const user = database
    .prepare('SELECT id, username, email, created_at FROM users WHERE id = ?')
    .get(result.lastInsertRowid) as Pick<DbUser, 'id' | 'username' | 'email' | 'created_at'>

  const session = formatSessionUser(user)
  return setSession(session)
}

export function login(payload: AuthPayload) {
  if (!payload) {
    throw new Error(AuthError.InvalidLoginPayload)
  }

  const database = getDatabase()
  const username = normalizeUsername(payload.username)
  const password = payload.password ?? ''

  if (!username || username.length < 2) {
    throw new Error(AuthError.UsernameTooShort)
  }

  if (!validatePassword(password)) {
    throw new Error(AuthError.PasswordTooShort)
  }

  const user = database
    .prepare('SELECT * FROM users WHERE username = ? LIMIT 1')
    .get(username) as DbUser | undefined

  if (!user) {
    throw new Error(AuthError.InvalidCredentials)
  }

  const computedHash = scryptSync(password, user.salt, 64)
  const currentHash = Buffer.from(user.password_hash, 'hex')

  if (!timingSafeEqual(computedHash, currentHash)) {
    throw new Error(AuthError.InvalidCredentials)
  }

  const session = formatSessionUser(user)
  return setSession(session)
}

export function ensureDefaultAdmin() {
  const database = getDatabase()
  const existing = database
    .prepare('SELECT id FROM users WHERE username = ? LIMIT 1')
    .get('admin') as { id: number } | undefined

  if (existing) {
    return
  }

  const { salt, passwordHash } = hashPassword('admin123')
  const insert = database.prepare(
    'INSERT INTO users (username, email, password_hash, salt) VALUES (?, ?, ?, ?)'
  )
  insert.run('admin', null, passwordHash, salt)
}
const AuthError = {
  InvalidLoginPayload: 'AUTH_INVALID_LOGIN_PAYLOAD',
  InvalidRegisterPayload: 'AUTH_INVALID_REGISTER_PAYLOAD',
  UsernameTooShort: 'AUTH_USERNAME_TOO_SHORT',
  EmailInvalid: 'AUTH_EMAIL_INVALID',
  PasswordTooShort: 'AUTH_PASSWORD_TOO_SHORT',
  UserExists: 'AUTH_USER_EXISTS',
  InvalidCredentials: 'AUTH_INVALID_CREDENTIALS'
} as const
