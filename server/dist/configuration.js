"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const yaml = require("js-yaml");
const node_path_1 = require("node:path");
const _ = require("lodash");
const commonFilePath = (0, node_path_1.join)(__dirname, '../config', `config.yaml`);
const envFilePath = (0, node_path_1.join)(__dirname, '../config', `config.${process.env.NODE_ENV}.yaml`);
const commonConfig = yaml.load((0, node_fs_1.readFileSync)(commonFilePath, 'utf-8'));
const envConfig = yaml.load((0, node_fs_1.readFileSync)(envFilePath, 'utf-8'));
exports.default = () => {
    return _.merge(commonConfig, envConfig);
};
//# sourceMappingURL=configuration.js.map