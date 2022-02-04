const Metalsmith = require('metalsmith')
const inplace = require('metalsmith-in-place')
const fingerprint = require('metalsmith-fingerprint-ignore')
const layouts = require('metalsmith-layouts')
const sass = require('metalsmith-sass')
const serve = require('metalsmith-serve')
const sitemap = require('metalsmith-sitemap')
const robots = require('metalsmith-robots')
const watch = require('metalsmith-watch')
const permalinks = require('metalsmith-permalinks')
const concat = require('metalsmith-concat')
const redirect = require('metalsmith-redirect')
const nunjucks = require('nunjucks')

let env = process.env.NODE_ENV || 'DEV'
console.log('Building for environment:', env)

const envOptions = {
  DEV: {
    'site_url': 'http://localhost:8081',
    'watch': true,
    'disallow': '/'
  },
  PRD: {
    'ga_tracking_id': 'UA-7294900-1',
    'site_url': 'https://www.exortech.com',
    'watch': false
  }
}

let options = envOptions[env]
console.log('Using options:', options)

nunjucks.configure(null, {
  noCache: true
})

let ms = Metalsmith(__dirname)
  .metadata({
    'year': new Date().getFullYear(),
    'img_root': '/img',
    'site_url': options['site_url'],
    'twitter_id': '@exortech',
    'ga_tracking_id': options['ga_tracking_id'],
    'livereload': options.watch
  })
  .source('./source')
  .destination('./public/')
  .clean(false)
  .use(sass({
    includePaths: ['./scss'],
    outputDir: 'css',
    outputStyle: 'compressed',
    sourceMap: true,
    sourceMapContents: true
  }))
  .use(concat({
    searchPaths: [
      'source',
      'node_modules'
    ],
    files: [
      'jquery.easing/jquery.easing.min.js',
      'js/jquery.fittext.js',
      'js/creative.js',
      'js/email-obfuscator.js'
    ],
    output: 'js/main.js'
  }))
  .use(fingerprint({
    pattern: [
      'css/main.css',
      'js/main.js'
    ]
  }))
  .use(layouts({
    pattern: '**/*.njk',
    default: 'default.njk'
  }))
  .use(inplace({
    pattern: '**/*.njk'
  }))
  .use(permalinks({
    relative: false
  }))
  .use(redirect({
    '/presentations/monolith_to_microservices/': 'https://exortech.github.io/presentations/monolith_to_microservices/',
    '/presentations/test_driven_decoupling/': 'https://exortech.github.io/presentations/test_driven_decoupling/',
    '/presentations/dev_ops_culture/': 'https://exortech.github.io/presentations/dev_ops_culture/',
    '/presentations/enterprise_mvps/': 'https://exortech.github.io/presentations/enterprise_mvps/',
    '/presentations/pivoting_midflight/': 'https://exortech.github.io/presentations/pivoting_midflight/',
    '/presentations/promise_of_node/': 'https://exortech.github.io/presentations/promise_of_node/'
  }))
  .use(sitemap({
    hostname: options['site_url'],
    omitIndex: true
  }))
  .use(robots({
    disallow: options['disallow'],
    sitemap: options['site_url'] + '/sitemap.xml'
  }))

if (options.watch) {
  ms.use(serve({
    port: 8081,
    'document_root': 'public',
    verbose: true,
    http_error_files: {
      404: '/404.html'
    }
  }))
  .use(watch({
    paths: {
      '${source}/**/*': true,
      'scss/**/*': '{main.scss,**/*.html}',
      'layouts/**/*': '**/*.html'
    },
    livereload: 35728
  }))
}

ms.build(function (err, files) {
  if (err) { throw err }
})
