import React, { useState, useEffect } from 'react';
import CheckinCard from '../components/CheckinCard';
import EncouragementModal from '../components/EncouragementModal';
import postgrest from '../utils/database';

const CheckinPage = () => {
  const [todayCheckins, setTodayCheckins] = useState({
    morning: null,
    evening: null
  });
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const userId = 'personal_user'; // 个人定制用户ID

  useEffect(() => {
    loadTodayCheckins();
    syncUserInfo();
  }, []);

  const syncUserInfo = async () => {
    try {
      // 为个人定制应用同步固定用户信息
      await postgrest
        .from('users')
        .upsert({
          id: userId,
          name: '个人用户',
          avatar: null,
          department: '个人'
        });
    } catch (error) {
      console.error('同步用户信息失败:', error);
    }
  };

  const loadTodayCheckins = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await postgrest
        .from('checkin_records')
        .select('*')
        .eq('user_id', userId)
        .eq('checkin_date', today);

      if (error) throw error;

      const checkins = { morning: null, evening: null };
      data.forEach(record => {
        checkins[record.checkin_type] = record;
      });
      
      setTodayCheckins(checkins);
    } catch (error) {
      console.error('加载打卡记录失败:', error);
      setTodayCheckins({ morning: null, evening: null });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async (type) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await postgrest
        .from('checkin_records')
        .insert({
          user_id: userId,
          checkin_date: today,
          checkin_type: type,
          is_completed: true
        })
        .select()
        .single();

      if (error) throw error;

      setTodayCheckins(prev => ({
        ...prev,
        [type]: data
      }));

      const { getRandomEncouragement } = await import('../utils/encouragement');
      setEncouragementMessage(getRandomEncouragement());
      setShowEncouragement(true);
    } catch (error) {
      console.error('打卡失败:', error);
      alert('打卡失败，请重试');
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">今日打卡</h2>
        <p className="text-gray-600">坚持运动，健康生活</p>
      </div>

      <div className="space-y-4">
        <CheckinCard
          type="morning"
          title="晨练打卡"
          subtitle="开启活力一天"
          icon="🌅"
          checkin={todayCheckins.morning}
          onCheckin={() => handleCheckin('morning')}
        />
        
        <CheckinCard
          type="evening"
          title="晚练打卡"
          subtitle="完美结束一天"
          icon="🌙"
          checkin={todayCheckins.evening}
          onCheckin={() => handleCheckin('evening')}
        />
      </div>

      <EncouragementModal
        show={showEncouragement}
        message={encouragementMessage}
        onClose={() => setShowEncouragement(false)}
      />
    </div>
  );
};

export default CheckinPage;