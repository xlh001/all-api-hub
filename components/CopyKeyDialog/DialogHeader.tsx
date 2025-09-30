import { DialogTitle } from "@headlessui/react";
import { KeyIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { DisplaySiteData } from "../../types";

interface DialogHeaderProps {
  account: DisplaySiteData | null;
  onClose: () => void;
}

export function DialogHeader({ account, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <KeyIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            密钥列表
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-0.5">
            {account?.name}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}