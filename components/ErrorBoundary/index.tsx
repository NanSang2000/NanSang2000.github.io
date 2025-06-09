'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0
  private readonly maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // 更新状态包含错误信息
    this.setState({
      error,
      errorInfo
    })
    
    // 在生产环境中记录更多细节
    if (typeof window !== 'undefined') {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        retryCount: this.retryCount
      })

      // 尝试发送错误报告到分析服务
      try {
        if (window.gtag) {
          window.gtag('event', 'exception', {
            description: error.message,
            fatal: false
          })
        }
      } catch (analyticsError) {
        console.warn('Failed to send error to analytics:', analyticsError)
      }
    }
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined 
      })
    } else {
      // 超过最大重试次数，重新加载页面
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    }
  }

  handleGoBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back()
      } else {
        window.location.href = '/'
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const canRetry = this.retryCount < this.maxRetries
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="ml-3 text-xl font-bold text-red-600 dark:text-red-400">
                页面出现错误
              </h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              抱歉，页面渲染时发生了错误。您可以尝试刷新页面或返回上一页。
            </p>
            
            {this.retryCount > 0 && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
                已重试 {this.retryCount} 次 {this.retryCount >= this.maxRetries && '（已达到最大重试次数）'}
              </p>
            )}
            
            <div className="flex space-x-3 mb-4">
              {canRetry 
                ? (
                  <button
                    onClick={this.handleRetry}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    重试 ({this.maxRetries - this.retryCount} 次机会)
                  </button>
                ) 
                : (
                  <button
                    onClick={() => typeof window !== 'undefined' && window.location.reload()}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    刷新页面
                  </button>
                )
              }
              
              <button
                onClick={this.handleGoBack}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                返回上页
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  错误详情 (开发模式)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto max-h-60">
                  <div className="mb-2">
                    <strong>错误信息:</strong>
                    <pre className="mt-1 text-red-600 dark:text-red-400">{this.state.error.message}</pre>
                  </div>
                  {this.state.error.stack && (
                    <div className="mb-2">
                      <strong>错误堆栈:</strong>
                      <pre className="mt-1 text-xs">{this.state.error.stack}</pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>组件堆栈:</strong>
                      <pre className="mt-1 text-xs">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 