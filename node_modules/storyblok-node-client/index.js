'use strict';

const API_ENDPOINT_DEFAULT = 'https://api.storyblok.com/v1';
const url = require('url');
const apiRequest = require('./src/apiRequest');
const rmDir = require('./src/rmDir');
const fs = require('fs');
const hash = require('object-hash');
let memory = {};
let cacheVersion = 0;

class Storyblok {

  constructor(config, endpoint) {
    if (!endpoint) { endpoint = API_ENDPOINT_DEFAULT; }

    this.privateToken = config.privateToken;
    this.endpoint = endpoint;
    this.cache = config.cache || {};
  }

  get(slug, options) {
    let query = options || {}
    if (!query.version) { query.version = 'published'; }
    if (!query.token) { query.token = this.getToken(); }

    let requestUrl = url.parse(`${this.endpoint}/cdn/${slug}`, true);

    requestUrl.query = query;
    requestUrl.query.cache_version = cacheVersion;

    return this.cacheResponse(requestUrl);
  }

  getToken() {
    return this.privateToken;
  }

  cacheResponse(requestUrl, response) {
    return new Promise((resolve, reject) => {
      let cacheKey = hash(requestUrl);
      let provider = this.cacheProvider();
      let cache = provider.get(cacheKey);

      if (requestUrl.query.version === 'published' && cache) {
        resolve(cache);
      } else {
        apiRequest(requestUrl)
          .then((response) => {
            let res = response.toJSON();

            if (res.statusCode != 200) {
              return reject(res);
            }

            res.body = JSON.parse(res.body);

            if (requestUrl.query.version === 'published') {
              provider.set(cacheKey, res);
            }
            resolve(res);
          })
          .catch((response) => {
            reject(response);
          });
      }
    })
  }

  cacheProvider() {
    let cacheConfig = this.cache

    switch(this.cache.type) {
      case 'filesystem':
        if (typeof this.cache.path === 'undefined') {
          throw new Error('Cache path is not defined')
        }

        return {
          get(key) {
            let filename = cacheConfig.path + key + '.json';

            if (fs.existsSync(filename)) {
              return JSON.parse(fs.readFileSync(filename));
            } else {
              return undefined;
            }
          },
          set(key, content) {
            fs.writeFileSync(cacheConfig.path + key + '.json', JSON.stringify(content));
          },
          flush() {
            rmDir(cacheConfig.path, false);
          }
        }
        break;

      case 'memory':
        return {
          get(key) {
            return memory[key];
          },
          set(key, content) {
            memory[key] = content;
          },
          flush() {
            memory = {};
          }
        }
        break;

      default:
        cacheVersion = new Date().getTime();

        return {
          get() { },
          set() { },
          flush() { }
        }
    }
  }

  flushCache() {
    cacheVersion = new Date().getTime();
    this.cacheProvider().flush();
    return this;
  }
}

module.exports = Storyblok;
