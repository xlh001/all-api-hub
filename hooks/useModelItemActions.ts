import toast from "react-hot-toast"

import type { ModelPricing } from "~/services/apiService/common/type"

export const useModelItemActions = (model: ModelPricing) => {
  const handleCopyModelName = async () => {
    try {
      await navigator.clipboard.writeText(model.model_name)
      toast.success("模型名称已复制")
    } catch (error) {
      toast.error("复制失败")
    }
  }

  return {
    handleCopyModelName
  }
}
