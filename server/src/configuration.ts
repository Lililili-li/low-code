import { readFileSync } from "node:fs";
import * as yaml from 'js-yaml'
import { join } from "node:path";
import * as _ from 'lodash'

const commonFilePath = join(__dirname, '../config', `config.yaml`)
const envFilePath = join(__dirname, '../config', `config.${process.env.NODE_ENV || 'dev'}.yaml`)
console.log(envFilePath);

const commonConfig = yaml.load(readFileSync(commonFilePath, 'utf-8'))

const envConfig = yaml.load(readFileSync(envFilePath, 'utf-8'))

export default () => {
  return _.merge(commonConfig, envConfig)
}