const shell = require('shelljs')
const path = require('path')
const fs = require('fs')
const colors = require('colors')

function start () {
    // Set the version info from the command line argument
    const versionFlag = process.argv[2]

    // read version info from package.json if versionFlag is not --dev
    // this is supposed to be the version that the current user 
    // wants to create a storybook build for
    let desiredVersion = 'dev'
    let desiredPath = path.join(__dirname, '../..', 'dist', desiredVersion)

    // Create path if versionFlag is not dev
    if(versionFlag !== '--dev') {
        packageJSON = JSON.parse(fs.readFileSync('package.json').toString())
        desiredVersion = packageJSON["sb-version"] || 'dev'
        desiredPath = path.join(__dirname, '../..', 'dist', desiredVersion)
    }

    // if command line versionFlag is '--new'
    // then desiredVersion should not exist in the dist directory
    if(versionFlag === '--new') {
        if(fs.existsSync(desiredPath) && desiredVersion !== 'dev') {
            throw Error(`The path ${desiredPath} already exists. If you want to override it, use command 'npm run build-sb-version-override'`.red)
            return
        }
    }
    else if(versionFlag === '--override') {
        if(!fs.existsSync(desiredPath) && desiredVersion !== 'dev') {
            throw Error(`The path ${desiredPath} does not exist. If you want to create it, use command 'npm run build-sb-version-new'`.red)
            return
        }
    }

    // Create the neccessary folders, in case they do not exist
    shell.exec('mkdir dist')
    shell.exec(`mkdir dist/${desiredVersion}`)

    // Build storybook in the desiredPath
    shell.exec(`build-storybook -o ${desiredPath} -s public`)

    // copy neccessary files to dist folder
    const pathToDist = path.join(__dirname, '../..', 'dist')
    const pathToSBVersionModule = path.join(__dirname, '../..', 'custom_modules', 'sb_versioning')
    const pathToVerInfoJSON = path.join(pathToSBVersionModule, 'versions_info.json')
    const pathToVerLoaderJS = path.join(pathToSBVersionModule, 'versions_selector_loader.js')
    const pathToDistIndex = path.join(pathToSBVersionModule, 'index.html')
    console.log('Copying versions_info.json to dist...'.blue)
    shell.exec(`cp ${pathToVerInfoJSON} ${pathToDist}`)
    console.log('Copying versions_selector_loader.js to dist...'.blue)
    shell.exec(`cp ${pathToVerLoaderJS} ${pathToDist}`)
    console.log('Copying index.html to dist...'.blue)
    shell.exec(`cp ${pathToDistIndex} ${pathToDist}`)


    // Add code to download and load versions_selector_loader.js
    const versionSelectorLoaderScript = `
        <script src="/dist/versions_selector_loader.js"></script></body></html>
    `

    // Inject the script in the newly built index.html
    const indexHtmlPath = path.join(desiredPath, 'index.html')
    let indexHtml = fs.readFileSync(indexHtmlPath).toString()
    indexHtml = indexHtml.replace('</body>', '').replace('</html>', versionSelectorLoaderScript)
    fs.writeFileSync(indexHtmlPath, indexHtml)
}


start()
console.log('DONE...'.blue)



