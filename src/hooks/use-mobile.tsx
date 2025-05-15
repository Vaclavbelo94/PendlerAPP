
import * as React from "react"

export const MOBILE_BREAKPOINT = 768
export const TABLET_BREAKPOINT = 1024
export const DESKTOP_BREAKPOINT = 1280

export type DeviceSize = "mobile" | "tablet" | "desktop" | undefined

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useDeviceSize() {
  const [deviceSize, setDeviceSize] = React.useState<DeviceSize>(undefined)

  React.useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth
      if (width < MOBILE_BREAKPOINT) {
        setDeviceSize("mobile")
      } else if (width < TABLET_BREAKPOINT) {
        setDeviceSize("tablet")
      } else {
        setDeviceSize("desktop")
      }
    }

    checkDeviceSize()
    window.addEventListener("resize", checkDeviceSize)
    return () => window.removeEventListener("resize", checkDeviceSize)
  }, [])

  return deviceSize
}
