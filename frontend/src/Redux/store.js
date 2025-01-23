import {
  combineReducers,
  legacy_createStore,
  applyMiddleware,
  compose,
} from "redux";
import thunk from "redux-thunk";
import { authReducer } from "./User/userReducer";

const rootReducer = combineReducers({
  auth: authReducer,
});

const create_compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = legacy_createStore(
  rootReducer,
  create_compose(applyMiddleware(thunk))
);
