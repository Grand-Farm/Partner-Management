import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('/api/user', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* deleteUser(action) {
  try {
    yield axios.delete(`api/user/${action.payload.id}`);
    yield put({ type: 'FETCH_ALL_USER' })
    yield put({ type: 'FETCH_UNASSIGNED' })
  } catch {
    console.log('error in delete user saga.');
  }
}

function* fetchAllUsers(){
  try {
    const response = yield axios.get('/api/user/all')
    console.log('response in fetch all users is:', response);
    yield put({ type: 'ALL_USER', payload: response.data });//reducer needs to be made
} catch {
    console.log('error in fetch all users saga.');
}
}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('DELETE_USER', deleteUser);
  yield takeLatest('FETCH_ALL_USER', fetchAllUsers);

}

export default userSaga;
