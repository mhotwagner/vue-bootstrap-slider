const fs = require('fs');
const path = require('path');
const vue = require('rollup-plugin-vue');
const buble = require('rollup-plugin-buble');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const {minify} = require('uglify-es');
const CleanCSS = require('clean-css');
const {camelCase} = require('lodash');
const {name, dependencies} = require('../package.json');

const base = path.resolve(__dirname, '..');
const lib = path.resolve(base, 'lib');
const dist = path.resolve(base, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist);
}

module.exports = {
    entry: path.resolve(lib, 'index.js'),
    external: Object.keys(dependencies),
    globals: {
      'bootstrap-slider': 'Slider'
    },
    moduleName: name,
    plugins: [
        vue({css: false}),
        resolve({external: ['vue']}),
        commonjs(),
        buble({objectAssign: 'Object.assign'}),
        uglify({}, minify)
    ],
    targets: [
        {
            format: 'cjs',
            moduleName: camelCase(name),
            dest: path.resolve(dist, name + '.common.js'),
            sourceMap: true
        },
        {
            format: 'es',
            dest: path.resolve(dist, name + '.esm.js'),
            sourceMap: true
        },
        {
            format: 'umd',
            moduleName: camelCase(name),
            dest: path.resolve(dist, name + '.js'),
            sourceMap: true
        }
    ]
};
