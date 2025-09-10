import React from 'react';

const CheckinCard = ({ type, title, subtitle, icon, checkin, onCheckin }) => {
  const isCompleted = !!checkin;
  
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
            {isCompleted && (
              <p className="text-xs text-success-600 mt-1">
                已完成 · {formatTime(checkin.checkin_time)}
              </p>
            )}
          </div>
        </div>
        
        <div>
          {isCompleted ? (
            <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-full">
              <span className="text-success-600 text-xl">✓</span>
            </div>
          ) : (
            <button
              onClick={onCheckin}
              className="btn-primary text-sm py-2 px-4"
            >
              打卡
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckinCard;