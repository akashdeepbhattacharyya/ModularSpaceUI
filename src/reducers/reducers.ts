import { combineReducers } from 'redux';
import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE } from '../action/actions';

const initialState = {
  data: null,
  error: null,
  isLoading: false,
};

interface DataAction {
  type: string;
  data?: any;
  error?: any;
}

const dataReducer = (state = initialState, action: DataAction) => {
  switch (action.type) {
    case FETCH_DATA_REQUEST:
      return { ...state, isLoading: true };
    case FETCH_DATA_SUCCESS:
      return { ...state, data: action.data, isLoading: false };
    case FETCH_DATA_FAILURE:
      return { ...state, error: action.error, isLoading: false };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  data: dataReducer,
});

export default rootReducer;