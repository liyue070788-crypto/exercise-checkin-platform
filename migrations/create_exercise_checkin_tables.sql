/*
  # 创建运动打卡平台数据库表

  1. 新建表
    - `users` 用户表
      - `id` (text, 主键)
      - `name` (text, 用户昵称)
      - `avatar` (text, 用户头像)
      - `department` (text, 用户部门)
      - `created_at` (timestamp, 创建时间)
    
    - `checkin_records` 打卡记录表
      - `id` (uuid, 主键)
      - `user_id` (text, 用户ID，外键)
      - `checkin_date` (date, 打卡日期)
      - `checkin_type` (text, 打卡类型：morning/evening)
      - `checkin_time` (timestamp, 打卡时间)
      - `is_completed` (boolean, 是否完成)
      - `created_at` (timestamp, 创建时间)

  2. 安全设置
    - 为所有表启用行级安全(RLS)
    - 添加用户访问策略，确保用户只能访问自己的数据
    
  3. 同步用户信息
    - 创建用户信息同步函数
*/

-- 创建用户表
CREATE TABLE IF NOT EXISTS users(
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 启用用户表RLS
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = current_schema()
          AND c.relname = 'users'
          AND c.relkind = 'r'
          AND NOT c.relrowsecurity
    ) THEN
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- 用户表策略
DROP POLICY IF EXISTS "Users can read all users" ON users;
CREATE POLICY "Users can read all users" ON users
    FOR SELECT USING(true);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING(auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK(auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete own profile" ON users;
CREATE POLICY "Users can delete own profile" ON users
    FOR DELETE USING(auth.uid() = id);

-- 创建打卡记录表
CREATE TABLE IF NOT EXISTS checkin_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
    checkin_type TEXT NOT NULL CHECK (checkin_type IN ('morning', 'evening')),
    checkin_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_completed BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, checkin_date, checkin_type)
);

-- 启用打卡记录表RLS
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = current_schema()
          AND c.relname = 'checkin_records'
          AND c.relkind = 'r'
          AND NOT c.relrowsecurity
    ) THEN
        ALTER TABLE checkin_records ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- 打卡记录表策略
DROP POLICY IF EXISTS "Users can read own checkin records" ON checkin_records;
CREATE POLICY "Users can read own checkin records" ON checkin_records
    FOR SELECT USING(user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own checkin records" ON checkin_records;
CREATE POLICY "Users can insert own checkin records" ON checkin_records
    FOR INSERT WITH CHECK(user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own checkin records" ON checkin_records;
CREATE POLICY "Users can update own checkin records" ON checkin_records
    FOR UPDATE USING(user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own checkin records" ON checkin_records;
CREATE POLICY "Users can delete own checkin records" ON checkin_records
    FOR DELETE USING(user_id = auth.uid());

-- 同步用户信息函数
CREATE OR REPLACE FUNCTION sync_user_info()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 插入或更新用户信息
  INSERT INTO users(id, name, avatar, department)
  VALUES(
    auth.uid(),
    auth.name(),
    auth.avatar(),
    auth.department()
  )
  ON CONFLICT(id) DO UPDATE
  SET
    name = auth.name(),
    avatar = auth.avatar(),
    department = auth.department();
END;
$$;