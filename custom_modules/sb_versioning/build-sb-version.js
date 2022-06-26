const shell = require('shelljs')
const path = require('path')
const fs = require('fs')
console.log('Successfully running inside ', __dirname)

const SB_VERSION = '0.0.1'
shell.exec('mkdir dist')
shell.exec(`mkdir dist/${SB_VERSION}`)

const out_dir = path.join(__dirname, '../..', 'dist', SB_VERSION)
console.log('out_dir = ', out_dir)

shell.exec(`build-storybook -o ${out_dir} -s public`)


// const dynamicCode = `
//     <script>
//         fetch('/dist/versions_info.json')
//         .then(res => res.json())
//         .then(v => {
//             console.log('v = ', v)

//             let htm = "Version: <select>"
//                     + v.versions.reduce((acc, op) => acc + '<option value="' + op.path + '">' + op.label + '</option>', '')
//                     + "</select>"

//             const sb_version_container = document.createElement('div')
//             sb_version_container.id = "sb_version_container"
//             sb_version_container.innerHTML = htm
//             document.querySelector('.sidebar-header').after(sb_version_container)
//         })
//     </script>
//     </body>
//     </html>
// `
// const indexHtmlPath = path.join(out_dir, 'index.html')
// let indexHtml = fs.readFileSync(indexHtmlPath).toString()
// indexHtml = indexHtml.replace('</body>', '').replace('</html>', dynamicCode)
// fs.writeFileSync(indexHtmlPath, indexHtml)

// Add code to download and load version_selector.html
const versionSelectorLoaderScript = `
    <script src="/dist/versions_selector_loader.js"></script></body></html>
`

const indexHtmlPath = path.join(out_dir, 'index.html')
let indexHtml = fs.readFileSync(indexHtmlPath).toString()
indexHtml = indexHtml.replace('</body>', '').replace('</html>', versionSelectorLoaderScript)
fs.writeFileSync(indexHtmlPath, indexHtml)

console.log('DONE ...')



