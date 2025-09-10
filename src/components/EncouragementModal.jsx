import React, { useEffect } from 'react';

const EncouragementModal = ({ show, message, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center transform animate-pulse">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">打卡成功！</h3>
        <p className="text-gray-600 text-lg leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 btn-success text-sm py-2 px-6"
        >
          继续加油
        </button>
      </div>
    </div>
  );
};

export default EncouragementModal;