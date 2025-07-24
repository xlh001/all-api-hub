import { useState } from "react"
import { CpuChipIcon, MagnifyingGlassIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useAccountData } from "../../hooks/useAccountData"

// 模拟模型数据类型
interface ModelInfo {
  id: string
  name: string
  description: string
  provider: string
  inputPrice: number   // 每1k tokens价格
  outputPrice: number  // 每1k tokens价格
  contextLength: number
  supported: boolean
}

// 模拟模型数据
const mockModels: ModelInfo[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'OpenAI 最新的大型语言模型',
    provider: 'OpenAI',
    inputPrice: 0.03,
    outputPrice: 0.06,
    contextLength: 8192,
    supported: true
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: '高性价比的对话模型',
    provider: 'OpenAI',
    inputPrice: 0.001,
    outputPrice: 0.002,
    contextLength: 4096,
    supported: true
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic 的旗舰模型',
    provider: 'Anthropic',
    inputPrice: 0.015,
    outputPrice: 0.075,
    contextLength: 200000,
    supported: true
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: '平衡性能和成本的模型',
    provider: 'Anthropic',
    inputPrice: 0.003,
    outputPrice: 0.015,
    contextLength: 200000,
    supported: true
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Google 的高性能模型',
    provider: 'Google',
    inputPrice: 0.0005,
    outputPrice: 0.0015,
    contextLength: 32768,
    supported: false
  }
]

export default function ModelList() {
  const { displayData } = useAccountData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<string>("all")
  const [selectedAccount, setSelectedAccount] = useState<string>("all")

  // 获取唯一的提供商列表
  const providers = Array.from(new Set(mockModels.map(model => model.provider)))

  // 过滤模型
  const filteredModels = mockModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvider = selectedProvider === "all" || model.provider === selectedProvider
    
    return matchesSearch && matchesProvider
  })

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <CpuChipIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">模型列表</h1>
        </div>
        <p className="text-gray-500">查看和管理可用的AI模型</p>
      </div>

      {/* 过滤器和搜索 */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索模型名称或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 提供商筛选 */}
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有提供商</option>
            {providers.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>

          {/* 账号筛选 */}
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有账号</option>
            {displayData.map(account => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>

        {/* 统计信息 */}
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <span>总计 {mockModels.length} 个模型</span>
          <span>支持 {mockModels.filter(m => m.supported).length} 个</span>
          <span>显示 {filteredModels.length} 个</span>
        </div>
      </div>

      {/* 模型列表 */}
      <div className="space-y-3">
        {filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <CpuChipIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">没有找到匹配的模型</p>
          </div>
        ) : (
          filteredModels.map((model) => (
            <div
              key={model.id}
              className={`border rounded-lg p-4 transition-colors ${
                model.supported 
                  ? 'border-gray-200 bg-white hover:border-gray-300' 
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`text-lg font-medium ${
                      model.supported ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {model.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      model.supported 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {model.supported ? (
                        <>
                          <CheckIcon className="w-3 h-3 mr-1" />
                          支持
                        </>
                      ) : (
                        <>
                          <XMarkIcon className="w-3 h-3 mr-1" />
                          不支持
                        </>
                      )}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {model.provider}
                    </span>
                  </div>
                  <p className={`text-sm mb-3 ${
                    model.supported ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {model.description}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">输入价格:</span>
                      <span className={`ml-2 font-medium ${
                        model.supported ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        ${model.inputPrice}/1K tokens
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">输出价格:</span>
                      <span className={`ml-2 font-medium ${
                        model.supported ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        ${model.outputPrice}/1K tokens
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">上下文长度:</span>
                      <span className={`ml-2 font-medium ${
                        model.supported ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {model.contextLength.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 说明文字 */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <CpuChipIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-blue-800 font-medium mb-1">模型支持说明</p>
            <p className="text-blue-700">
              模型的可用性取决于各个API站点的配置。请在相应的站点管理页面查看具体支持的模型列表。
              价格信息仅供参考，实际费用以各站点公布的价格为准。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}