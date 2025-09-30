import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">获取失败</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <button
            onClick={onRetry}
            className="mt-3 px-3 py-1.5 bg-red-100 text-red-800 text-xs rounded-lg hover:bg-red-200 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    </div>
  );
}