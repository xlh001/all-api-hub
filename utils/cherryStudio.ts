import toast from "react-hot-toast";
import type { ApiToken, DisplaySiteData } from "~/types";

interface CherryStudioExportData {
  id: string;
  baseUrl: string;
  apiKey: string;
  name: string;
}

function generateCherryStudioURL(data: CherryStudioExportData): string {
  const jsonString = JSON.stringify(data);
  const base64String = btoa(jsonString);
  const processedBase64 = encodeURIComponent(base64String)
  return `cherrystudio://providers/api-keys?v=1&data=${processedBase64}`;
}

export function OpenInCherryStudio(account: DisplaySiteData, token: ApiToken) {
  if (!account || !token) {
    toast.error("缺少必要的账户或密钥信息");
    return;
  }

  const exportData: CherryStudioExportData = {
    id: account.id,
    baseUrl: account.baseUrl,
    apiKey: token.key,
    name: account.name,
  };

  const url = generateCherryStudioURL(exportData);

  try {
    window.open(url, "_blank");
    toast.success("正在尝试跳转到 Cherry Studio");
  } catch (error) {
    console.error("无法打开 Cherry Studio URL:", error);
    toast.error("无法打开，请确保已安装 Cherry Studio");
  }
}