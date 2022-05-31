const APP_PREFIX = 'budgettracker'
const VERSION = 'version1'
const CACHE_NAME = APP_PREFIX + VERSION
const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/index.js',
    './manifest.json',
    './icons/icon-72x72',
    './icons/icon-96x96',
    './icons/icon-128x128',
    './icons/icon-144x144',
    './icons/icon-152x152',
    './icons/icon-192x192',
    './icons/icon-384x384',
    './icons/icon-512x512'
]

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.open(e.request).then(function(request) {
            if (request) {
                return request
            } else {
                return fetch(e.request)
            }
        })
    )
})

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            let cacheKeepList = KeyList.filter(function(key) {
                return key.indexOf(APP_PREFIX)
            })
            cacheKeepList.push(CACHE_NAME)
            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeepList.indexOf(key) === -1) {
                    return caches.delete(keyList[i])
                }
            }))
        })
    )
})