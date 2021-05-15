module.exports = {
    // antd 样式的按需引入
    babel: {
        plugins: [['import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: 'css',
        }]],
    },
};

