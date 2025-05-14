import React from "react";

function WarningModal({ onContinue, onBack, onSuggestAlternative }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Cảnh báo</h2>
        <p className="mb-6 text-gray-700">
          Món ăn này không phù hợp với tình trạng tiểu đường của bạn.
          Bạn có thể tiếp tục, quay lại hoặc xem món thay thế.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onContinue}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Tiếp tục
          </button>
          <button
            onClick={onBack}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Quay lại
          </button>
          <button
            onClick={onSuggestAlternative}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Đề xuất món khác
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningModal;


