'use strict'

const chalk = require('chalk')
const nodeSpawn = require('child_process').spawn

module.exports = function spawn(pkgNm, script, args, opts) {
  return new Promise((resolve, reject) => {
    const p = nodeSpawn(/^win/.test(process.platform) ? `${script}.cmd` : script, args, {cwd: opts.cwd})

    let result = ''
    if (!opts.quiet) {
      p.stdout.on('data', (data) => {
        result += data
        process.stdout.write(`${chalk.green(pkgNm)} ${data}`)
      })
      p.stderr.on('data', (data) => {
        process.stderr.write(`${chalk.red(pkgNm)} ${data}`)
      })
    }

    p.on('exit', (code) => {
      if (code === 0) {
        if (!opts.quiet) {
          console.log(`${chalk.green(pkgNm)} Done`)
        }
        resolve(result)
      } else {
        const err = new Error('Failure')
        if (!opts.quiet) {
          console.error(`${chalk.red(pkgNm)} exit code #${code}`)
        }
        err.code = code
        err.scope = pkgNm
        reject(err)
      }
    })
  })
}
