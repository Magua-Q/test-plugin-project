import React, { useState, useEffect } from 'react';
import { mockPluginAPI } from './mockAPI';

interface PluginInfo {
  id: string;
  name: string;
  jsUrl: string;
  version: string;
}

interface DynamicComponentLoaderProps {
  pluginId?: string;
}

interface WindowWithReact extends Window {
  React?: typeof React;
  PluginComponent?: React.ComponentType;
  process?: { env: { NODE_ENV: string } };
}

const DynamicComponentLoader: React.FC<DynamicComponentLoaderProps> = ({ 
  pluginId = 'default' 
}) => {
  const [PluginComponent, setPluginComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pluginInfo, setPluginInfo] = useState<PluginInfo | null>(null);

  useEffect(() => {
    const loadPlugin = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. 调用后台接口获取插件信息
        const info = await mockPluginAPI.getPluginInfo(pluginId);
        setPluginInfo(info);
        console.log('Plugin info:', info);

        // 2. 动态加载远程JS模块
        console.log('Loading plugin from:', info.jsUrl);
        
        // 对于开发环境，我们需要特殊处理本地文件
        let module;
        if (info.jsUrl.startsWith('/plugin-component.js') || info.jsUrl.startsWith('/dist/plugin-component.js')) {
          // 确保React在全局可用
          const React = await import('react');
          (window as WindowWithReact).React = React;
          
          console.log('React global set:', !!(window as WindowWithReact).React);
          
          // UMD模块：通过script标签加载并从全局访问
          const response = await fetch(info.jsUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch plugin: ${response.statusText}`);
          }
          const jsCode = await response.text();
          
          console.log('JS code length:', jsCode.length);
          console.log('JS code preview:', jsCode.substring(0, 200));
          
          // 清除之前可能存在的组件
          delete (window as WindowWithReact).PluginComponent;
          
          // 执行UMD代码
          try {
            // 为UMD脚本提供必要的全局变量
            const windowWithReact = window as WindowWithReact;
            const originalProcess = windowWithReact.process;
            windowWithReact.process = { env: { NODE_ENV: 'production' } };
            
            // 使用Function构造器而不是script标签
            new Function(jsCode)();
            
            // 恢复原始process对象
            if (originalProcess) {
              windowWithReact.process = originalProcess;
            } else {
              delete windowWithReact.process;
            }
          } catch (execError) {
            console.error('Script execution error:', execError);
            throw new Error(`Failed to execute plugin script: ${execError}`);
          }
          
          // 等待一小段时间确保脚本执行完成
          await new Promise(resolve => setTimeout(resolve, 100));
          
          console.log('Window keys after execution:', Object.keys(window).filter(k => k.includes('Plugin')));
          console.log('PluginComponent type:', typeof (window as WindowWithReact).PluginComponent);
          
          // 从全局获取组件
          const Component = (window as WindowWithReact).PluginComponent;
          if (!Component) {
            console.error('Available global objects:', Object.keys(window).filter(k => !k.startsWith('webkit')));
            throw new Error('Plugin component not found in global scope');
          }
          
          console.log('Component type:', typeof Component);
          console.log('Component name:', Component.name);
          
          // 确保Component是一个React组件函数
          if (typeof Component === 'function') {
            // 直接使用，不要预先调用测试
            setPluginComponent(() => Component);
          } else {
            // 如果不是函数，可能是已经创建的元素，包装成函数
            const element = Component;
            setPluginComponent(() => () => element);
          }
          
          console.log('Plugin loaded successfully');
          return;
        } else {
          // 远程文件：直接使用动态import
          module = await import(/* @vite-ignore */ info.jsUrl);
        }

        const Component = module.default;
        if (!Component) {
          throw new Error('Plugin does not export a default component');
        }

        setPluginComponent(() => Component);
        console.log('Plugin loaded successfully');
      } catch (err) {
        console.error('Failed to load plugin:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadPlugin();
  }, [pluginId]);

  if (loading) {
    return (
      <div style={{ padding: '20px', border: '1px dashed #ccc', borderRadius: '4px' }}>
        <p>🔄 Loading plugin "{pluginId}"...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ff6b6b', borderRadius: '4px', backgroundColor: '#ffe0e0' }}>
        <p>❌ Error loading plugin: {error}</p>
        <p>Plugin ID: {pluginId}</p>
      </div>
    );
  }

  if (!PluginComponent) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ffa500', borderRadius: '4px', backgroundColor: '#fff4e0' }}>
        <p>⚠️ No plugin component found</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '2px solid #4caf50', borderRadius: '4px', backgroundColor: '#f0fff0' }}>
      <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
        ✅ Plugin loaded: {pluginInfo?.name} (v{pluginInfo?.version})
      </div>
      <PluginComponent />
    </div>
  );
};

export default DynamicComponentLoader;