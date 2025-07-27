(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory());
}((function() {
  // 确保在浏览器环境中 global 指向 window
  if (typeof window !== 'undefined') return window;
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof global !== 'undefined') return global;
  if (typeof self !== 'undefined') return self;
  throw new Error('Unable to locate global object');
})(), (function () { 'use strict';

  // 确保React全局可用
  const globalObj = (function() {
    if (typeof window !== 'undefined') return window;
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof global !== 'undefined') return global;
    if (typeof self !== 'undefined') return self;
    throw new Error('Unable to locate global object');
  })();

  if (globalObj.React) {
    const React = globalObj.React;
    const { createElement, useState } = React;

    // 创建一个简单的插件组件
    function PluginComponent() {
      const [count, setCount] = useState(0);
      
      return createElement('div', {
        style: {
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          textAlign: 'center'
        }
      }, [
        createElement('h3', { key: 'title' }, 'Custom Plugin Component'),
        createElement('p', { key: 'desc' }, 'This is a dynamically loaded UMD plugin!'),
        createElement('button', {
          key: 'btn',
          onClick: () => setCount(count + 1),
          style: {
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }, `Plugin clicks: ${count}`)
      ]);
    }

    // 暴露到全局
    globalObj.PluginComponent = PluginComponent;
  } else {
    console.error('React is not available globally. Plugin cannot be loaded.');
  }

})));