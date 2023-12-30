import { combineReducers } from 'redux';
import articles from './articles';
import users from './users';
import files from './files';
import settings from './settings';
import journal from './journal';
import newsletter from './newsletter';

const rootReducer = combineReducers({
  articles,
  users,
  files,
  settings,
  journal,
  newsletter
});

export default rootReducer;
