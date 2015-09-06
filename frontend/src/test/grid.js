/* @flow */

import * as assert from "assert"
import {Catalogue} from "../live/library"
import * as fs from 'fs'

			year: 1888,
		}

describe('library', () => {
	var mock_library_json = fs.readFileSync( "../../../test-data/mea-katalogo-2.json", 'utf-8')
	var mock_catalogue = Catalogue(mock_library_json)

	describe('.get_all_books()', () => {
		it('should get seven books', () => assert.equal(1649, mock_catalogue.get_all_books().length))
	})
})

		})
	})
})
