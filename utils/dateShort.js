import moment from 'moment'

// time
export const dateShort = () => {
  const date = moment().format('HH:mm')
  return date
}
