import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { SessionUser } from './store'
import { getDatabase } from './database'
import { getSession, setSession } from './store'

type DbUser = {
  id: number
  username: string
  email: string
  password_hash: string
  salt: string
  created_at: string
}

export type AuthPayload = {
  email: string
  password: string
  username?: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizeUsername(username: string) {
  return username.trim()
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
  const database = getDatabase()
  const email = normalizeEmail(payload.email)
  const username = normalizeUsername(payload.username ?? '')
  const password = payload.password

  if (!username || username.length < 2) {
    throw new Error('用户名至少需要 2 个字符。')
  }

  if (!validateEmail(email)) {
    throw new Error('请输入有效的邮箱地址。')
  }

  if (!validatePassword(password)) {
    throw new Error('密码至少需要 6 位。')
  }

  const exists = database
    .prepare('SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1')
    .get(email, username) as { id: number } | undefined

  if (exists) {
    throw new Error('该邮箱或用户名已存在。')
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
  const database = getDatabase()
  const email = normalizeEmail(payload.email)
  const password = payload.password

  if (!validateEmail(email)) {
    throw new Error('请输入有效的邮箱地址。')
  }

  if (!validatePassword(password)) {
    throw new Error('密码至少需要 6 位。')
  }

  const user = database
    .prepare('SELECT * FROM users WHERE email = ? LIMIT 1')
    .get(email) as DbUser | undefined

  if (!user) {
    throw new Error('账号或密码错误。')
  }

  const computedHash = scryptSync(password, user.salt, 64)
  const currentHash = Buffer.from(user.password_hash, 'hex')

  if (!timingSafeEqual(computedHash, currentHash)) {
    throw new Error('账号或密码错误。')
  }

  const session = formatSessionUser(user)
  return setSession(session)
}
