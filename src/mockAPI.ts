// 模拟后台API服务
export const mockPluginAPI = {
  // 模拟获取插件信息的接口
  async getPluginInfo(pluginId: string) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟不同插件的配置
    const plugins = {
      'default': {
        id: 'default',
        name: 'Default Plugin',
        jsUrl: '/dist/plugin-component.js',
        version: '1.0.0'
      },
      'custom': {
        id: 'custom', 
        name: 'Custom Plugin',
        jsUrl: '/plugin-component.js', // 使用本地文件
        version: '1.1.0'
      }
    };

    const plugin = plugins[pluginId as keyof typeof plugins];
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    return plugin;
  }
};

// 在实际项目中，你会调用真实的后台接口：
// const response = await fetch(`/api/plugin/${pluginId}`);
// const data = await response.json();