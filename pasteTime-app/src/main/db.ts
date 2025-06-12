import path from 'node:path';
import { app } from 'electron';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// 记录类型
export interface ClipRecord {
  id: number;
  content_type: string;
  content_data: string;
  meta_data?: string;
  created_at: string;
}

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

/**
 * 初始化 SQLite 数据库（单例）。
 */
export async function initDB() {
  if (db) return db;
  const dbPath = path.join(app.getPath('userData'), 'clipboard.db');
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  // 打开后建表
  await db.exec(`CREATE TABLE IF NOT EXISTS clipboard_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_type TEXT NOT NULL,
    content_data TEXT,
    meta_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`);
  return db;
}

/**
 * 插入新记录，超出 100 条时自动删除最旧记录。
 */
export async function addRecord(type: string, data: string, meta: any = null) {
  const database = await initDB();
  const metaJson = meta ? JSON.stringify(meta) : null;
  await database.run(
    'INSERT INTO clipboard_history (content_type, content_data, meta_data) VALUES (?,?,?)',
    [type, data, metaJson],
  );
  // 删除多余记录
  await database.run(
    `DELETE FROM clipboard_history WHERE id IN (
      SELECT id FROM clipboard_history ORDER BY created_at ASC LIMIT (
        SELECT CASE WHEN COUNT(*) > 100 THEN COUNT(*)-100 ELSE 0 END FROM clipboard_history
      )
    );`,
  );
}

/**
 * 删除指定记录
 */
export async function deleteRecord(id: number) {
  const database = await initDB();
  await database.run('DELETE FROM clipboard_history WHERE id = ?', id);
}

/**
 * 清空所有记录
 */
export async function clearAll() {
  const database = await initDB();
  await database.run('DELETE FROM clipboard_history');
}

export interface SearchFilters {
  keyword?: string;
  type?: 'text' | 'image';
  startTime?: string; // ISO
  endTime?: string;   // ISO
  limit?: number;
  offset?: number;
}

/**
 * 查询记录，支持关键词、类型、时间区间过滤。
 */
export async function searchRecords(filters: SearchFilters = {}): Promise<ClipRecord[]> {
  const database = await initDB();
  const conds: string[] = [];
  const params: any[] = [];
  if (filters.type) {
    conds.push('content_type = ?');
    params.push(filters.type);
  }
  if (filters.keyword) {
    conds.push('content_data LIKE ?');
    params.push(`%${filters.keyword}%`);
  }
  if (filters.startTime) {
    conds.push('created_at >= ?');
    params.push(filters.startTime);
  }
  if (filters.endTime) {
    conds.push('created_at <= ?');
    params.push(filters.endTime);
  }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const limit = filters.limit ?? 50;
  const offset = filters.offset ?? 0;

  return database.all<ClipRecord[]>(
    `SELECT * FROM clipboard_history ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    ...params,
    limit,
    offset,
  );
}

/**
 * 根据 ID 获取记录
 */
export async function getRecordById(id: number): Promise<ClipRecord | undefined> {
  const database = await initDB();
  return database.get<ClipRecord>('SELECT * FROM clipboard_history WHERE id = ?', id);
} 