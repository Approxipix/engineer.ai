import * as c from './constants';

const initialState = {
  isFetching: false,
  page: null,
  totalPage: null,
  search: '',
  searchBy: '',
  data: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.FETCH_REQUEST: {
      return {
        ...state,
        isFetching: true,
      }
    }

    case c.FETCH_SUCCESS: {
      return {
        ...state,
        isFetching: false,
      }
    }

    case c.ADD_DATA: {
      const { page, totalPage, data, isLoadMore } = action.payload;
      return {
        ...state,
        page,
        totalPage,
        data: isLoadMore ? [...state.data, ...data] : data,
      }
    }

    case c.SET_SEARCH: {
      const { value, searchBy } = action.payload;
      return {
        ...state,
        search: value,
        searchBy,
      }
    }

    default: {
      return state;
    }
  }
};

export default reducer;