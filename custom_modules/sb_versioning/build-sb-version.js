const shell = require('shelljs')
const path = require('path')
const fs = require('fs')
console.log('Successfully running inside ', __dirname)

const SB_VERSION = '0.0.3'
shell.exec('mkdir dist')
shell.exec(`mkdir dist/${SB_VERSION}`)

const out_dir = path.join(__dirname, '../..', 'dist', SB_VERSION)
console.log('out_dir = ', out_dir)

shell.exec(`build-storybook -o ${out_dir} -s public`)


// Add code to download and load version_selector.html
const versionSelectorLoaderScript = `
    <script src="/dist/versions_selector_loader.js"></script></body></html>
`

// Inject the script in the newly built index.html
const indexHtmlPath = path.join(out_dir, 'index.html')
let indexHtml = fs.readFileSync(indexHtmlPath).toString()
indexHtml = indexHtml.replace('</body>', '').replace('</html>', versionSelectorLoaderScript)
fs.writeFileSync(indexHtmlPath, indexHtml)

console.log('DONE ...')



