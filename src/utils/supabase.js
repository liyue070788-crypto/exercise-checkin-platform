import { createClient } from '@supabase/supabase-js'

// Supabase配置 - 需要在Vercel中设置环境变量
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// 用户ID生成函数
export const getUserId = () => {
  let userId = localStorage.getItem('user_id')
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('user_id', userId)
  }
  return userId
}
