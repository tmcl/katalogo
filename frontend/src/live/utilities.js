/** @flow */

import * as Promise from 'when'

export var liftP1 
	: <T, R>(f:(t:T)=>R, p1:Promise<T>) => Promise<R>
	= f => (p1        ) => p1.then(a1 =>                             f(a1          ))
export var liftP2 
	: <T, U, R>(f:(t:T, u:U)=>R, p1:Promise<T>, p2:Promise<U>) => Promise<R>
	= f => (p1, p2    ) => p1.then(a1 => p2.then(a2 =>               f(a1, a2     )))
export var liftP3 
	: <T, U, V, R>(f:(t:T, u:U, u:V)=>R, p1:Promise<T>, p2:Promise<U>, p3:Promise<V>) => Promise<R>
	= f => (p1, p2, p3) => p1.then(a1 => p2.then(a2 => p3.then(a3 => f(a1, a2, a3))))

export var cache_method 
	: (f:()=>any) => () => any
	= (f) => ((cache) => () => {
	if (!cache)
		cache = f()
	return cache
})(null)

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
			request.setRequestHeader("Accept", "application/json")
			request.send()
		})
}
