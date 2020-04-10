import * as c from './constants';

export const fetchRequest = () => ({
  type: c.FETCH_REQUEST
});

export const fetchSuccess = () => ({
  type: c.FETCH_SUCCESS
});

export const addData = ({ page, totalPage, data, isLoadMore }) => ({
  type: c.ADD_DATA,
  payload: { page, totalPage, data, isLoadMore },
});

export const setSearch = value => ({
  type: c.SET_SEARCH,
  payload: value,
});