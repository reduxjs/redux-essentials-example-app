import { parseISO, formatDistanceToNow } from 'date-fns'

interface TimeAgoProps {
  timestamp: string
}

export const TimeAgo = ({ timestamp }: TimeAgoProps) => {
  let timeAgo = ''
  if (timestamp) {
    const date = parseISO(timestamp)
    const timePeriod = formatDistanceToNow(date)
    timeAgo = `${timePeriod} ago`
  }

  return (
    <time dateTime={timestamp} title={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </time>
  )
}
