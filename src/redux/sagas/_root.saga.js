import { all } from 'redux-saga/effects';
import companySaga from './company.saga';
import loginSaga from './login.saga';
import projectSaga from './project.saga';
import registrationSaga from './registration.saga';
import taskSaga from './task.saga';
import userSaga from './user.saga';
import membersSaga from './members.saga';
import documentsSaga from './documents.saga';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),
    companySaga(),
    projectSaga(),
    taskSaga(),
    membersSaga(),
    documentsSaga()
  ]);
}
