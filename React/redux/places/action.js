<<<<<<< HEAD
import Place from 'services/api/Place'

export const OPEN_PLACE = 'OPEN_PLACE'
export const LOAD_PLACES = 'LOAD_PLACES'
export const LOAD_PLACES_PENDING = 'LOAD_PLACES_PENDING'
export const LOAD_PLACES_REJECTED = 'LOAD_PLACES_REJECTED'
export const LOAD_PLACES_FULFILLED = 'LOAD_PLACES_FULFILLED'

const load = (params) => ({
  type: LOAD_PLACES,
  payload: Place.all(params),
})

const open = place_id => ({
  type: OPEN_PLACE,
  payload: place_id,
})

export default { load, open }
=======
import place from 'api/Place'

export const LOAD_PLACE = 'LOAD_PLACE'
export const LOAD_PLACE_FULFILLED = 'LOAD_PLACE_FULFILLED'

export const CREATE_PLACE = 'CREATE_PLACE'
export const CREATE_PLACE_FULFILLED = 'CREATE_PLACE_FULFILLED'

export const UPDATE_PLACE = 'UPDATE_PLACE'
export const UPDATE_PLACE_FULFILLED = 'UPDATE_PLACE_FULFILLED'

export const SET_PLACE = 'SET_PLACE'
export const SET_PLACES = 'SET_PLACES'
export const REMOVE_PLACE = 'REMOVE_PLACE'

/**
 * Async actions. Making API requests
 */

const load = (place_id) => ({
  type: LOAD_PLACE,
  payload: place.load(place_id)
})

const create = form => ({
  type: CREATE_PLACE,
  payload: place.create(form)
})

const update = (place_id, form) => ({
  type: UPDATE_PLACE,
  payload: place.update(place_id, form)
})

/**
 * Sync actions. Updating store
 */

const setMany = places => ({
  type: SET_PLACES,
  payload: places,
})

const set = place => ({
  type: SET_PLACE,
  payload: place,
})

const remove = place_id => ({
  type: REMOVE_PLACE,
  payload: place_id,
})

export default {
  load,
  create,
  update,

  set,
  setMany,
  remove,
}
>>>>>>> cd7913e3e94a5f7396e4d3433ad0e9bc1da694ee
