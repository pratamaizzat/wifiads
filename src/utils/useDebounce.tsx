import * as React from 'react'

export default function useDebounce(
	callback: (e: React.ChangeEvent<HTMLInputElement>) => void,
	time = 1000
) {
	const debounce = React.useCallback(
		(cb: (e: React.ChangeEvent<HTMLInputElement>) => void, delay = 1000) => {
			let timeout: NodeJS.Timeout

			return (args: React.ChangeEvent<HTMLInputElement>) => {
				clearTimeout(timeout)

				timeout = setTimeout(() => {
					cb(args)
				}, delay)
			}
		},
		[]
	)

	return debounce(callback, time)
}