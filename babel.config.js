module.exports = function (api) {
    api.cache(true);

    const presets = [];
    const plugins = [
        ["@babel/plugin-proposal-decorators", { "version": "2023-05" }]
    ];

    return {
        presets,
        plugins
    };
}