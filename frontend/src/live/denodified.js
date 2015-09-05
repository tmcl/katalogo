/** @flow */

import * as Promise from 'when'
import * as fs from 'fs'

var error_result_rejector 
	= (resolve, reject) => (err, res) => {
		if (err)
			reject(err)
		else if (res)
			resolve(res)
}

var promisify = f => Promise.promise((resolve, reject, notify) => f(error_result_rejector(resolve, reject)))

export var readFile
	: (path: string) => Promise<string>
	= (path) => promisify(p => fs.readFile(path, p))
