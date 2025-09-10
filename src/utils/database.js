// 智能数据库客户端 - 支持多种环境
class SmartDatabase {
  constructor() {
    this.isOneDayEnvironment = this.checkOneDayEnvironment();
    this.initializeClient();
  }

  checkOneDayEnvironment() {
    const ONEDAY_CONFIG = window.ONEDAY_CONFIG || window.parent?.window.ONEDAY_CONFIG;
    return !!(ONEDAY_CONFIG?.database_config?.token);
  }

  async initializeClient() {
    if (this.isOneDayEnvironment) {
      // OneDay环境 - 使用原有配置
      const { PostgrestClient } = await import('@supabase/postgrest-js');
      const ONEDAY_CONFIG = window.ONEDAY_CONFIG || window.parent.window.ONEDAY_CONFIG;
      
      this.client = new PostgrestClient(`${location.origin}/database`, {
        headers: {
          Authorization: `Bearer ${ONEDAY_CONFIG.database_config.token}`
        },
        schema: ONEDAY_CONFIG.database_config.schema,
        fetch: window.parent ? window.parent.window.fetch : window.fetch,
      });
    } else {
      // Vercel环境 - 使用localStorage降级
      this.client = this.createLocalStorageClient();
    }
  }

  createLocalStorageClient() {
    return {
      from: (table) => ({
        select: (columns = '*') => ({
          eq: (column, value) => ({
            eq: (column2, value2) => this.handleSelect(table, { [column]: value, [column2]: value2 }),
            gte: (column2, value2) => this.handleDateRange(table, column, value, column2, value2, 'gte'),
            lte: (column2, value2) => this.handleDateRange(table, column, value, column2, value2, 'lte')
          }),
          order: (column, options) => ({
            order: (column2, options2) => this.handleSelect(table, {}, [{ column, ...options }, { column: column2, ...options2 }])
          })
        }),
        insert: (data) => ({
          select: () => ({
            single: () => this.handleInsert(table, data)
          })
        }),
        upsert: (data) => this.handleUpsert(table, data)
      }),
      rpc: (functionName) => this.handleRpc(functionName)
    };
  }

  async handleSelect(table, filters = {}, orderBy = []) {
    try {
      const key = `${table}_records`;
      const records = JSON.parse(localStorage.getItem(key) || '[]');
      
      let filteredRecords = records.filter(record => {
        return Object.entries(filters).every(([key, value]) => record[key] === value);
      });

      // 应用排序
      if (orderBy.length > 0) {
        filteredRecords.sort((a, b) => {
          for (const sort of orderBy) {
            const { column, ascending = true } = sort;
            const aVal = a[column];
            const bVal = b[column];
            
            if (aVal !== bVal) {
              if (ascending) {
                return aVal > bVal ? 1 : -1;
              } else {
                return aVal < bVal ? 1 : -1;
              }
            }
          }
          return 0;
        });
      }

      return { data: filteredRecords, error: null };
    } catch (error) {
      return { data: [], error };
    }
  }

  async handleDateRange(table, column1, value1, column2, value2, operator) {
    try {
      const key = `${table}_records`;
      const records = JSON.parse(localStorage.getItem(key) || '[]');
      
      const filteredRecords = records.filter(record => {
        const matchesFirst = record[column1] === value1;
        const dateValue = record[column2];
        
        if (operator === 'gte') {
          return matchesFirst && dateValue >= value2;
        } else if (operator === 'lte') {
          return matchesFirst && dateValue <= value2;
        }
        return matchesFirst;
      });

      // 按日期倒序排列
      filteredRecords.sort((a, b) => {
        if (a.checkin_date === b.checkin_date) {
          return a.checkin_type === 'morning' ? -1 : 1;
        }
        return new Date(b.checkin_date) - new Date(a.checkin_date);
      });

      return { data: filteredRecords, error: null };
    } catch (error) {
      return { data: [], error };
    }
  }

  async handleInsert(table, data) {
    try {
      const key = `${table}_records`;
      const records = JSON.parse(localStorage.getItem(key) || '[]');
      
      const newRecord = {
        id: Date.now().toString(),
        ...data,
        checkin_time: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      records.push(newRecord);
      localStorage.setItem(key, JSON.stringify(records));
      
      return { data: newRecord, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async handleUpsert(table, data) {
    try {
      const key = `${table}_records`;
      const records = JSON.parse(localStorage.getItem(key) || '[]');
      
      const existingIndex = records.findIndex(r => r.id === data.id);
      
      if (existingIndex >= 0) {
        records[existingIndex] = { ...records[existingIndex], ...data };
      } else {
        records.push({ ...data, created_at: new Date().toISOString() });
      }
      
      localStorage.setItem(key, JSON.stringify(records));
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async handleRpc(functionName) {
    // 模拟RPC调用
    if (functionName === 'sync_user_info') {
      return this.handleUpsert('users', {
        id: 'personal_user',
        name: '个人用户',
        avatar: null,
        department: '个人'
      });
    }
    return { data: null, error: null };
  }

  // 代理方法到实际客户端
  from(table) {
    return this.client.from(table);
  }

  rpc(functionName) {
    return this.client.rpc(functionName);
  }
}

// 创建单例实例
const smartDatabase = new SmartDatabase();
export default smartDatabase;
