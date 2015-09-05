/** @flow */

import * as Promise from 'when'

var liftP1 = f => (p1        ) => p1.then(a1 =>                             f(a1          ))
var liftP2 = f => (p1, p2    ) => p1.then(a1 => p2.then(a2 =>               f(a1, a2     )))
var liftP3 = f => (p1, p2, p3) => p1.then(a1 => p2.then(a2 => p3.then(a3 => f(a1, a2, a3))))

export var ajax
	: (url:string) => Promise
	= (url) => {
		var handler = (resolve, reject, request) => () => {
			if (request.readyState == 4 && request.status == 200)
				resolve(request.responseText)
			else if ( request.readyState == 4 && request.status !== 200 )
				reject(request.status)
		}

		var request = new XMLHttpRequest()
		return Promise.promise( (resolve, reject, notify) => {
			request.onreadystatechange = handler(resolve, reject, request)
			request.open("GET", url, true)
			request.send()
		})
}
