# exortech.com [![Build Status](https://travis-ci.org/exortech/exortech.com.svg?branch=master)](https://travis-ci.org/exortech/exortech.com)

This is the website for [exortech.com](https://www.exortech.com).

## Setting up the web site

1. Install node.js 6+ `brew install node`
1. Install dependencies `npm install`
1. Build and launch the website `npm run build`
1. Browse to `http://localhost:8081` to view the site

Pages and images are in the `source` folder. Stylesheets (built using [Sass](http://sass-lang.com/)) are in the `scss` folder.

The site is built using [Metalsmith](http://www.metalsmith.io/), the static site generator. [Nunjucks](https://mozilla.github.io/nunjucks/) is used for page templating.

Files processed by Metalsmith are output to the `public` folder. The contents of this folder are rendered when browsing to the site.

## Deploying

The site content is hosted on AWS S3 and served through Cloudfront.

Committing changes to git will cause [TravisCI](https://travis-ci.org/exortech/exortech.com) to trigger a new build which will push the changes to S3, automatically redeploying the website.
