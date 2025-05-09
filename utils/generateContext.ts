import type { Context, contextChild, contextItems } from '../types'

// Helper function to safely extract the title string from a potentially multilingual title object
function extractTitle(titleObj: any): string {
  // 处理null或undefined
  if (titleObj === null || titleObj === undefined) {
    return '';
  }
  
  // 处理字符串类型（包括分隔符标题）
  if (typeof titleObj === 'string') {
    return titleObj;
  }
  
  // 处理多语言标题对象
  if (
    typeof titleObj === 'object' && 
    ((typeof titleObj.zh === 'string' && titleObj.zh) || 
     (typeof titleObj.en === 'string' && titleObj.en))
  ) {
    // 在服务器端渲染时，我们无法访问localStorage，所以默认返回中文标题
    // 客户端渲染时会通过LanguageContext组件正确处理语言切换
    return (typeof titleObj.zh === 'string' ? titleObj.zh : '') || 
           (typeof titleObj.en === 'string' ? titleObj.en : '') || 
           '';
  }
  
  // 处理其他类型的对象，安全地转换为字符串
  try {
    return JSON.stringify(titleObj);
  } catch (e) {
    console.error('无法将对象转换为字符串:', e);
    return '';
  }
}

export default function generateContext (json: any, title: string): Context {
  // 如果传入的是JSON字符串，则解析为对象
  if (typeof json === 'string') {
    try {
      json = JSON.parse(json)
    } catch (e) {
      console.error('解析JSON字符串失败:', e)
      return { title, children: [] }
    }
  }
  const context: Context = {
    title,
    children: []
  }
  for (const key in json) {
    // eslint-disable-next-line
    if (json.hasOwnProperty(key)) {
      const value = json[key]
      if (key.startsWith('--')) {
        const child: contextItems = {
          title: typeof value === 'object' ? extractTitle(value) : value,
          children: []
        }
        context.children.push(child)
      } else if (key !== '*') {
        const child: contextChild = {
          link: typeof value === 'object' ? 
            (value.title ? extractTitle(value.title) : JSON.stringify(value)) : 
            String(value),
          title: key
        }
        if (context.children.length === 0) {
          context.children.push({
            title: '',
            children: []
          })
        }
        context.children[context.children.length - 1].children.push(child)
      }
    }
  }
  return context
}
