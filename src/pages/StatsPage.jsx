import React, { useState, useEffect } from 'react';
import postgrest from '../utils/database';

const StatsPage = () => {
  const [stats, setStats] = useState({
    totalDays: 0,
    totalCheckins: 0,
    morningCheckins: 0,
    eveningCheckins: 0,
    currentStreak: 0,
    longestStreak: 0
  });
  const [loading, setLoading] = useState(true);

  const userId = 'personal_user'; // 个人定制用户ID

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await postgrest
        .from('checkin_records')
        .select('*')
        .eq('user_id', userId)
        .order('checkin_date', { ascending: true });

      if (error) throw error;

      const records = data || [];
      const calculatedStats = calculateStats(records);
      setStats(calculatedStats);
    } catch (error) {
      console.error('加载统计数据失败:', error);
      setStats({
        totalDays: 0,
        totalCheckins: 0,
        morningCheckins: 0,
        eveningCheckins: 0,
        currentStreak: 0,
        longestStreak: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (records) => {
    if (records.length === 0) {
      return {
        totalDays: 0,
        totalCheckins: 0,
        morningCheckins: 0,
        eveningCheckins: 0,
        currentStreak: 0,
        longestStreak: 0
      };
    }

    const totalCheckins = records.length;
    const morningCheckins = records.filter(r => r.checkin_type === 'morning').length;
    const eveningCheckins = records.filter(r => r.checkin_type === 'evening').length;

    const dateGroups = records.reduce((groups, record) => {
      const date = record.checkin_date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    }, {});

    const totalDays = Object.keys(dateGroups).length;

    const { currentStreak, longestStreak } = calculateStreaks(dateGroups);

    return {
      totalDays,
      totalCheckins,
      morningCheckins,
      eveningCheckins,
      currentStreak,
      longestStreak
    };
  };

  const calculateStreaks = (dateGroups) => {
    const dates = Object.keys(dateGroups).sort();
    if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateGroups[todayStr] || dateGroups[yesterdayStr]) {
      currentStreak = 1;
      
      let checkDate = dateGroups[todayStr] ? today : yesterday;
      
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          tempStreak++;
          if (dates[i] <= (dateGroups[todayStr] ? todayStr : yesterdayStr)) {
            currentStreak = tempStreak;
          }
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          if (dates[i] > (dateGroups[todayStr] ? todayStr : yesterdayStr)) {
            currentStreak = 0;
          }
        }
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    return { currentStreak, longestStreak };
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`text-3xl opacity-20`}>{icon}</div>
      </div>
    </div>
  );

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">运动统计</h2>
        <p className="text-gray-600">你的运动成就一览</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="累计天数"
          value={stats.totalDays}
          subtitle="已坚持运动"
          icon="📅"
          color="primary"
        />
        
        <StatCard
          title="总打卡次数"
          value={stats.totalCheckins}
          subtitle="运动记录"
          icon="✅"
          color="success"
        />
        
        <StatCard
          title="晨练次数"
          value={stats.morningCheckins}
          subtitle="早起运动"
          icon="🌅"
          color="warning"
        />
        
        <StatCard
          title="晚练次数"
          value={stats.eveningCheckins}
          subtitle="夜间运动"
          icon="🌙"
          color="primary"
        />
      </div>

      <div className="space-y-4">
        <StatCard
          title="当前连续天数"
          value={`${stats.currentStreak} 天`}
          subtitle="保持这个势头！"
          icon="🔥"
          color="success"
        />
        
        <StatCard
          title="最长连续记录"
          value={`${stats.longestStreak} 天`}
          subtitle="你的最佳成绩"
          icon="🏆"
          color="warning"
        />
      </div>

      {stats.totalCheckins > 0 && (
        <div className="card bg-gradient-to-r from-primary-50 to-success-50 border-primary-200">
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">运动成就</h3>
            <p className="text-gray-700">
              {stats.totalDays >= 30 ? '运动达人！已坚持一个月' :
               stats.totalDays >= 7 ? '运动新星！已坚持一周' :
               stats.totalCheckins >= 10 ? '运动爱好者！' :
               '运动新手，继续加油！'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;