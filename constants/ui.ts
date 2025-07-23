/**
 * UI 相关常量定义
 */

export const UI_CONSTANTS = {
  // 弹窗尺寸
  POPUP: {
    WIDTH: 'w-96',
    HEIGHT: 'h-[600px]',
    MAX_HEIGHT: 'max-h-[90vh]'
  },

  // 动画配置
  ANIMATION: {
    INITIAL_DURATION: 1.5,
    UPDATE_DURATION: 0.8,
    FAST_DURATION: 0.6,
    SLOW_DURATION: 1.0
  },

  // 更新间隔
  UPDATE_INTERVAL: 30000, // 30秒

  // 排序相关
  SORT: {
    DEFAULT_FIELD: 'balance' as const,
    DEFAULT_ORDER: 'desc' as const
  },

  // Token 格式化阈值
  TOKEN: {
    MILLION_THRESHOLD: 1000000,
    THOUSAND_THRESHOLD: 1000
  },

  // 汇率相关
  EXCHANGE_RATE: {
    DEFAULT: 7.2,
    CONVERSION_FACTOR: 500000 // USD to quota conversion
  },

  // 样式类名
  STYLES: {
    // 按钮样式
    BUTTON: {
      PRIMARY: 'flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm',
      SECONDARY: 'flex items-center justify-center py-2.5 px-3 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200',
      ICON: 'p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200'
    },
    
    // 状态指示器
    STATUS_INDICATOR: {
      HEALTHY: 'bg-green-500',
      ERROR: 'bg-red-500',
      WARNING: 'bg-yellow-500',
      UNKNOWN: 'bg-gray-400'
    },

    // 文本颜色
    TEXT: {
      PRIMARY: 'text-gray-900',
      SECONDARY: 'text-gray-500',
      SUCCESS: 'text-green-500',
      ERROR: 'text-red-500',
      WARNING: 'text-yellow-500'
    },

    // 输入框
    INPUT: {
      BASE: 'block w-full py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
      WITH_ICON: 'pl-10'
    }
  }
} as const

export const CURRENCY_SYMBOLS = {
  USD: '$',
  CNY: '¥'
} as const

export const HEALTH_STATUS_MAP = {
  healthy: { color: UI_CONSTANTS.STYLES.STATUS_INDICATOR.HEALTHY, text: '正常' },
  error: { color: UI_CONSTANTS.STYLES.STATUS_INDICATOR.ERROR, text: '错误' },
  warning: { color: UI_CONSTANTS.STYLES.STATUS_INDICATOR.WARNING, text: '警告' },
  unknown: { color: UI_CONSTANTS.STYLES.STATUS_INDICATOR.UNKNOWN, text: '未知' }
} as const