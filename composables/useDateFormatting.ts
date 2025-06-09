/**
 * Composable for locale-aware date formatting using i18n
 */
export const useDateFormatting = () => {
  const { d } = useI18n()

  /**
   * Format a date using the current locale (short format)
   * @param date - Date string or Date object
   * @returns Formatted date string
   */
  const formatDate = (date: string | Date): string => {
    return d(new Date(date), 'short')
  }

  /**
   * Format a date and time using the current locale (long format)
   * @param date - Date string or Date object
   * @returns Formatted date and time string
   */
  const formatDateTime = (date: string | Date): string => {
    return d(new Date(date), { key: 'long' })
  }

  /**
   * Format only the time using the current locale
   * @param date - Date string or Date object
   * @returns Formatted time string
   */
  const formatTime = (date: string | Date): string => {
    return d(new Date(date), 'shortTime')
  }

  return {
    formatDate,
    formatDateTime,
    formatTime,
  }
}
