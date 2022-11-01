export const parseDate = (date?: string, onlyDate?: boolean) => {
  if (!date) return 'not exist'

  const splitDate = date.split('T')

  if (onlyDate) return splitDate[0].split('-').reverse().join('.')

  return splitDate[0].split('-').reverse().join('.') + ' ' + splitDate[1].substring(0, 5)
}
