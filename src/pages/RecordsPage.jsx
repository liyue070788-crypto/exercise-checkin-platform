import React, { useState, useEffect } from 'react';
import postgrest from '../utils/database';

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const userId = 'personal_user'; // 个人定制用户ID

  useEffect(() => {
    loadRecords();
  }, [selectedMonth]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const startDate = `${selectedMonth}-01`;
      const endDate = `${selectedMonth}-31`;
      
      const { data, error } = await postgrest
        .from('checkin_records')
        .select('*')
        .eq('user_id', userId)
        .gte('checkin_date', startDate)
        .lte('checkin_date', endDate)
        .order('checkin_date', { ascending: false })
        .order('checkin_type', { ascending: true });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('加载记录失败:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type) => {
    return type === 'morning' ? '晨练' : '晚练';
  };

  const getTypeIcon = (type) => {
    return type === 'morning' ? '🌅' : '🌙';
  };

  const groupedRecords = records.reduce((groups, record) => {
    const date = record.checkin_date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">打卡记录</h2>
        
        <div className="mb-6">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {Object.keys(groupedRecords).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📅</div>
          <p className="text-gray-500">本月暂无打卡记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedRecords).map(([date, dayRecords]) => (
            <div key={date} className="card">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900">{formatDate(date)}</h3>
              </div>
              
              <div className="space-y-2">
                {dayRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getTypeIcon(record.checkin_type)}</span>
                      <div>
                        <span className="font-medium text-gray-900">
                          {getTypeLabel(record.checkin_type)}
                        </span>
                        <div className="text-sm text-gray-600">
                          {formatTime(record.checkin_time)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center w-8 h-8 bg-success-100 rounded-full">
                      <span className="text-success-600 text-sm">✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordsPage;