export const parseDate = (date: string) => {
  const splitDate = date.split('T')

  return splitDate[0].split('-').reverse().join('.') + ' ' + splitDate[1].substring(0, 5)
}
