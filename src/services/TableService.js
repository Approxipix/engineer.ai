import store from '../redux/store';
import * as a from '../redux/actions';
import { notification } from 'antd';

class TableService {
  static loadData = ({ page = 0, search, isLoadMore } = {}) => {
    const url = new URL('https://hn.algolia.com/api/v1/search');
    const params = { page, tags: 'story' };
    if (search) params.query = search;
    Object.keys(params).forEach((key => url.searchParams.append(key, params[key])));

    store.dispatch(dispatch => {
      dispatch(a.fetchRequest());
      fetch(url)
        .then(response => {
          if (!response.ok) throw response;
          return response.json();
        })
        .then(response => {
          dispatch(a.addData({
            page: response.page,
            totalPage: response.nbPages,
            data: response.hits,
            isLoadMore,
          }))
        })
        .catch(error => {
          notification.error({
            message: 'Loading Error!',
            description: error.message,
          });
        })
        .finally(() => dispatch(a.fetchSuccess()))
    })
  };

  static loadMoreData = () => {
    const { isFetching, page, totalPage, search } = store.getState();
    if (isFetching || page >= totalPage) return;
    this.loadData({ page: page + 1, isLoadMore: true, search });
  };

  static loadByTimer = () => {
    const loadInterval = setInterval(() => {
      const { page, totalPage } = store.getState();
      if (page >= totalPage) return clearInterval(loadInterval);
      this.loadMoreData();
    }, 10000)
  };

  static searchData = value => {
    store.dispatch(a.setSearch(value));
    this.loadData({ search: value });
  };
}

export default TableService;