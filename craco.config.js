// module.exports = {
//     // antd 样式的按需引入
//     babel: {
//         plugins: [
//             // 配置样式按需引入
//             ['import', {libraryName: 'antd',libraryDirectory: 'es',style: 'css',}],
//             // 配置支持装饰器语法
//             ['@babel/plugin-proposal-decorators', {legacy: true }]
//         ],
//     },
// };

// 该插件支持less，babel-plugin-import按需引入，自定义主题
const CracoAntDesignPlugin = require("craco-antd");

module.exports = {
    plugins: [{ plugin: CracoAntDesignPlugin }],
    babel: {
        plugins: [
            // 配置支持装饰器语法
            ['@babel/plugin-proposal-decorators', { legacy: true }]
        ],
    },
};
