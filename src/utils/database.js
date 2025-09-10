import { PostgrestClient } from '@supabase/postgrest-js';

// 个人定制应用，使用固定用户ID但保持数据库持久化
const ONEDAY_CONFIG = window.ONEDAY_CONFIG || window.parent.window.ONEDAY_CONFIG;

const REST_URL = `${location.origin}/database`;
const postgrest = new PostgrestClient(REST_URL, {
  headers: {
    Authorization: `Bearer ${ONEDAY_CONFIG?.database_config?.token}`
  },
  schema: ONEDAY_CONFIG?.database_config?.schema,
  fetch: window.parent ? window.parent.window.fetch : window.fetch,
});

export default postgrest;