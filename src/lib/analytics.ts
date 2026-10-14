import mixpanel from 'mixpanel-browser'

// Keep development visits and automated local checks out of production reports.
const enabled = import.meta.env.PROD
  && ['aibaker.io', 'www.aibaker.io'].includes(window.location.hostname)
  && !/^\/mmatx\/?$/.test(window.location.pathname)

export function initAnalytics() {
  if (!enabled) return
  try {
    mixpanel.init('ae13938bd7e20932cad1a6aaadca058d', {
      autocapture: true,
      track_pageview: 'url-with-path',
      record_sessions_percent: 100,
      record_mask_all_inputs: true,
      record_mask_all_text: true,
    })
  } catch (error) {
    console.warn('Analytics unavailable', error)
  }
}

export function trackEvent(event: string, properties: Record<string, string | number | boolean> = {}) {
  if (!enabled) return
  try {
    mixpanel.track(event, properties)
  } catch {
    // Analytics must never interrupt a contact request.
  }
}
