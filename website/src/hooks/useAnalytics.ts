import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export function initAnalytics() {
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID)
  }
}

export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname + location.search,
      })
    }
  }, [location.pathname, location.search])
}

export function trackEvent(category: string, action: string, label?: string) {
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({ category, action, label })
  }
}

export function trackWhatsAppClick(source: string) {
  trackEvent('WhatsApp', 'click', source)
}

export function trackProductView(code: string, name: string) {
  trackEvent('Product', 'view', `${code} - ${name}`)
}

export function trackCTAClick(label: string) {
  trackEvent('CTA', 'click', label)
}

export function trackFormSubmit(formName: string) {
  trackEvent('Form', 'submit', formName)
}
