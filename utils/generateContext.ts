import type { Context, contextChild, contextItems } from '../types'

export default function generateContext (json: any, title: string): Context {
  const context: Context = {
    title: title || '',
    children: []
  }
  
  // 严格检查输入参数
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    console.warn('generateContext: Invalid json input', json)
    return context
  }

  if (!title || typeof title !== 'string') {
    console.warn('generateContext: Invalid title input', title)
    return context
  }
  
  try {
    for (const key in json) {
      // 更严格的属性检查
      if (!Object.prototype.hasOwnProperty.call(json, key) || !key) {
        continue
      }

      const value = json[key]
      
      if (key.startsWith('--')) {
        // 处理分组标题
        const child: contextItems = {
          title: (value && typeof value === 'object' && value.title) ? String(value.title) : '',
          children: []
        }
        context.children.push(child)
      } else {
        // 处理普通链接项
        const child: contextChild = {
          link: value ? String(value) : key,
          title: String(key)
        }
        
        // 确保至少有一个分组存在
        if (context.children.length === 0) {
          context.children.push({
            title: '',
            children: []
          })
        }
        
        // 添加到最后一个分组
        const lastGroup = context.children[context.children.length - 1]
        if (lastGroup && Array.isArray(lastGroup.children)) {
          lastGroup.children.push(child)
        }
      }
    }
  } catch (error) {
    console.error('generateContext: Error processing data', error)
    // 返回默认结构而不是抛出错误
    return {
      title: title || '',
      children: []
    }
  }
  
  return context
}
