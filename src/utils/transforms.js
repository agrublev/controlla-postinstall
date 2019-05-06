import { reportAndThrowError, stripLeadingSlash, stripTrailingSlash } from './misc'
import { fetchLogo, fetchPkg, fetchStats } from './fetch'

export const controllaSlugFromUrl = url => url.substr(url.lastIndexOf('/') + 1).toLowerCase().replace(/\.json/g, '')

export const controllaUrl = pkg => {
  const url = pkg.controlla && pkg.controlla.url

  if (!url) {
    reportAndThrowError('No controlla URL set!')
  }

  return stripTrailingSlash(url)
}

// use pkg.controlla.logo for "legacy"/compatibility reasons
export const controllaLogoUrl = pkg => pkg.controlla.logo || pkg.controlla.logoUrl || false

export const controllaDonationText = pkg => (pkg.controlla.donation && pkg.controlla.donation.text) || 'Visit:'

export const getControlla = async pkgPath => {
  const pkg = fetchPkg(pkgPath)
  const url = controllaUrl(pkg)
  const baseControlla = {
    url,
    slug: controllaSlugFromUrl(url),
    logoUrl: controllaLogoUrl(pkg),
    donationUrl: controllaDonationUrl(pkg),
    donationText: controllaDonationText(pkg)
  }
  const logoUrl = baseControlla.logoUrl
  const promises = [fetchStats(url)].concat(logoUrl ? fetchLogo(logoUrl) : [])

  const [stats, logo] = await Promise.all(promises)

  return Object.assign(baseControlla, { stats, logo })
}

export const controllaDonationUrl = pkg => {
  const defaultDonationAmount = pkg.controlla.donation && pkg.controlla.donation.amount

  let donateUrl = `${controllaUrl(pkg)}/${retrieveDonationSlug(pkg)}`

  if (defaultDonationAmount) {
    return `${donateUrl}/${defaultDonationAmount}`
  }

  return donateUrl
}

export const retrieveDonationSlug = pkg => {
  const rawDonationSlug = (pkg.controlla.donation && pkg.controlla.donation.slug)

  if (!rawDonationSlug) {
    return ''
  }

  return stripLeadingSlash(rawDonationSlug)
}
