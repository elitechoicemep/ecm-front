const fs = require('fs');
const path = require('path');
const url = require('url');
const { run } = require('react-snap');
const pkg = require('../package.json');

const publicUrl = process.env.PUBLIC_URL || pkg.homepage;
const reactScriptsVersion = parseInt(
  (pkg.devDependencies && pkg.devDependencies['react-scripts']) ||
    (pkg.dependencies && pkg.dependencies['react-scripts']),
  10
);

let fixWebpackChunksIssue;
if (reactScriptsVersion === 1) fixWebpackChunksIssue = 'CRA1';
if (reactScriptsVersion === 2) fixWebpackChunksIssue = 'CRA2';

const options = {
  publicPath: publicUrl ? url.parse(publicUrl).pathname : '/',
  fixWebpackChunksIssue,
  ...pkg.reactSnap,
};

const localChrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (process.platform === 'win32' && fs.existsSync(localChrome)) {
  options.puppeteerExecutablePath = localChrome;
}

run(options).catch(error => {
  console.error(error);
  process.exit(1);
});
