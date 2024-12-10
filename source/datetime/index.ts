/** Returns a string date represents a given date related to the current date */
export function dateToRelativeTime(date: Date): string {
	const delta = Math.round((+new Date() - (+date)) / 1000)
	const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	const minute = 60
	const hour = minute * 60
	const day = hour * 24
	const month = day * 30
	const year = month * 12

	switch (true) {
		case (delta < 30):
			return 'a few seconds ago'
		case (delta < minute):
			return `${delta} seconds ago`
		case (delta < 2 * minute):
			return 'a minute ago'
		case (delta < hour):
			return `${Math.floor(delta / minute)} minutes ago`
		case (Math.floor(delta / hour) === 1):
			return '1 hour ago'
		case (delta < day):
			return `${Math.floor(delta / hour)} hours ago`
		case (delta < day * 2):
			return 'yesterday'
		case (delta < day * 7):
			return `last ${weekDays[date.getDay()]}`
		case (delta < day * 30):
			return `${Math.floor(delta / day)} days ago`
		case (delta < month * 2):
			return '1 month ago'
		case (delta < month * 12):
			return `${Math.floor(delta / month)} months ago`
		case (delta < year * 2):
			return "1 year ago"
		default:
			return `${Math.floor(delta / year)} years ago`
	}
}

/** Returns a string representing the date object formated as "YYMMDD hh:mm:ss" */
export function dateToYearMonthDayHourMinuteSecond(date: Date): string {
	const yyyy = date.getFullYear().toString()
	let dd = date.getDate().toString()
	let mm = (date.getMonth() + 1).toString()

	if (dd.length === 1)
		dd = `0${dd}`

	if (mm.length === 1)
		mm = `0${mm}`
	const currentDate = `${yyyy}-${mm}-${dd}`

	let hours = date.getHours().toString()
	let minutes = date.getMinutes().toString()
	let seconds = date.getSeconds().toString()

	if (hours.length === 1)
		hours = `0${hours}`

	if (minutes.length === 1)
		minutes = `0${minutes}`

	if (seconds.length === 1)
		seconds = `0${seconds}`

	return `${currentDate} ${hours}:${minutes}:${seconds}`
}

export function dateToYearMonthDay(date: Date) {
	const d = date.getDate()
	const m = date.getMonth() + 1 //Month from 0 to 11
	const y = date.getFullYear()
	return `${y}-${m <= 9 ? `0${m}` : m}-${d <= 9 ? `0${d}` : d}`
}

export function timeAgo(timestamp: number) {
	const now = Date.now()
	const secondsPast = Math.floor((now - timestamp) / 1000)

	const intervals = [
		{ label: "year", seconds: 31536000 },
		{ label: "month", seconds: 2592000 },
		{ label: "week", seconds: 604800 },
		{ label: "day", seconds: 86400 },
		{ label: "hour", seconds: 3600 },
		{ label: "minute", seconds: 60 },
		{ label: "second", seconds: 1 }
	] as const

	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

	for (const interval of intervals) {
		const count = Math.floor(secondsPast / interval.seconds)
		if (count > 0) {
			return rtf.format(-count, interval.label)
		}
	}

	return rtf.format(0, 'second')
}

/** Date represented as string according to ISO 8601 (yyyy-mm-dd) */
export type DateString = `${number}-${number}=${number}`

export type DayName = WeekDayName | WeekEndName
export type WeekDayName = "Mon" | "Tue" | "Wed" | "Thu" | "Fri"
export type WeekEndName = "Sat" | "Sun"

export type MonthName = (
	| "January"
	| "February"
	| "March"
	| "April"
	| "May"
	| "June"
	| "July"
	| "August"
	| "September"
	| "October"
	| "November"
	| "December"
)
