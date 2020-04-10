import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, Modal, DatePicker, Input, Button } from 'antd';
import TableService from '../services/TableService';
const { Search } = Input;

const TableData = () => {
  const tableContent = document.querySelector('.ant-table-body');
  const { isFetching, data } = useSelector(state => state);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const handleScroll = e => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    if (offsetHeight + scrollTop >= scrollHeight) TableService.loadMoreData()
  };

  const getColumnSearchProps = dataIndex => ({
    onFilter: (value, item) => {
      const itemValue = item[dataIndex] || '';
      return itemValue.toString().toLowerCase().includes(value.toLowerCase())
    },
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        {dataIndex === 'created_at' ? (
          <DatePicker
            placeholder={`Filter by ${dataIndex}`}
            onChange={(value, date) => setSelectedKeys(date ? [date] : [])}
            onPressEnter={() => confirm()}
            style={{ display: 'block', width: 190, marginBottom: 8 }}
          />
        ) : (
          <Input
            placeholder={`Filter by ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ display: 'block', width: 190, marginBottom: 8 }}
          />
        )}
        <Button
          type="primary"
          size="small"
          onClick={() => confirm()}
          style={{ width: 90, marginRight: 8 }}
        >
          Filter
        </Button>
        <Button
          size="small"
          onClick={() => clearFilters()}
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    )
  });

  const columns = [
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      ellipsis: true
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      ...getColumnSearchProps('title') },
    {
      title: 'Url',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      ...getColumnSearchProps('url') },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      ellipsis: true,
      ...getColumnSearchProps('created_at') },
  ];

  useEffect(() => {
    if (!tableContent) return;
    tableContent.addEventListener('scroll', handleScroll);
    return () => tableContent.removeEventListener('scroll', handleScroll);
  }, [tableContent]);

  useEffect(() => {
    TableService.loadData();
    TableService.loadByTimer();
  }, []);

  return (
    <>
      <Search
        placeholder="Search"
        size="large"
        enterButton
        onSearch={value => {
          tableContent.scrollTo({ top: 0 });
          TableService.searchData(value);
        }}
        style={{ width: 450, marginBottom: 16 }}
      />
      <Table
        bordered
        size="middle"
        columns={columns}
        dataSource={data}
        loading={isFetching}
        pagination={false}
        scroll={{ y: 'calc(100vh - 170px)' }}
        scrollToFirstRowOnChange
        rowKey={item => item.objectID}
        onRow={row => ({
          onClick: () => {
            setSelectedRow(row);
            setShowModal(true);
          },
        })}
      />
      <Modal
        title={selectedRow.author || ''}
        width={650}
        footer={null}
        visible={showModal}
        onCancel={() => setShowModal(false)}
      >
       <pre>{JSON.stringify(selectedRow, null, ' ')}</pre>
      </Modal>
    </>
  )
};

export default TableData;