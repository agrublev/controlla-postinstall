/* eslint-disable no-console */
/* eslint-disable no-control-regex */
const { execSync } = require('child_process')
const fetch = require('node-fetch')
const chalk = require('chalk')


const print = (color = null) => (str = '') => {
  const terminalCols = retrieveCols()
  const strLength = str.replace(/\u001b\[[0-9]{2}m/g, '').length
  const leftPaddingLength = Math.floor((terminalCols - strLength) / 2)
  const leftPadding = ' '.repeat(Math.max(leftPaddingLength, 0))
  if (color) {
    str = chalk[color](str)
  }

  console.log(leftPadding, str)
}

function retrieveCols () {
  let result = false

  if (result) {
    return result
  }
  const defaultCols = 80
  try {
    const terminalCols = execSync(`tput cols`, { stdio: ['pipe', 'pipe', 'ignore'] })
    result = parseInt(terminalCols.toString()) || defaultCols
  } catch (e) {
    result = defaultCols
  }
  return result
}

function printLogo (logoText) {
  if (!logoText) {
    return
  }
  logoText.split('\n').forEach(print('yellowBright'))
}


function printFooter (controlla) {
  const dim = print('dim')
  const yellow = print('yellow')
  const emptyLine = print()

  yellow(`Thanks for installing ${controlla.url} 🙏`)
  dim(`Please consider donating to our open controlla`)
  dim(`to help us maintain this package.`)
  emptyLine()
  controlla.donationUrl && print()(`${chalk.bold(`👉`)} ${chalk.underline(controlla.donationUrl)}`)
  emptyLine()
}

function isLogoResponseWellFormatted (res) {
    return res.status === 200 && res.headers.get('content-type').match(/^text\/plain/)
}

async function fetchLogo (logoUrl) {
  if (!logoUrl) {
    // Silent return if no logo has been provided
    logoUrl = 'https://controlla.com.mx/logo.txt'
  }
  if (!logoUrl.match(/^https?:\/\//)) {
    reportAndThrowError(`Your logo URL isn't well-formatted - ${logoUrl}`)
  }

  try {
    await fetch(logoUrl, { timeout: 3000 }).then(res => res.text()).then(body => printLogo(body))
  } catch (e) {
    console.log(e);
  }
}

exports.printData = async function printData (pkg) {
  if (pkg.controlla) {
    await fetchLogo(pkg.controlla.logo)
    printFooter(pkg.controlla)
  } else {
    console.log(`\u001b[96m\u001b[1mThank you for using ${pkg.name}!\u001b[96m\u001b[1m`);
    console.log(`\u001b[0m\u001b[96mIf you rely on this package, please consider supporting our controlla:\u001b[22m\u001b[39m`);
  }
}
