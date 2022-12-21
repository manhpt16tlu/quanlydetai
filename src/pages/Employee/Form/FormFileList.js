import { DownloadOutlined } from '@ant-design/icons';
import { Button, Divider, message, Spin, Table } from 'antd';
import { antdIconFontSize, TIMESTAMP_FORMAT } from 'configs/general';
import moment from 'moment';
import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import * as formService from 'services/FormService';
import * as uploadSerivce from 'services/UploadFileService';
import { INITIAL_PAGE_STATE, pageReducer } from 'utils/formUtil';
import { getFileNameFromHeaderDisposition } from 'utils/general';
function FormFileList() {
  const [loading, setLoading] = useState(false);
  const [dataPaging, dispatch] = useReducer(pageReducer, INITIAL_PAGE_STATE);
  const dataIndexTable = {
    id: 'ma',
    name: 'tenbieumau',
    type: 'loai',
    date: 'ngaybanhanh',
  };
  const generateTableData = (forms) => {
    return forms.map((form, index) => ({
      key: index,
      [dataIndexTable.name]: form.name,
      [dataIndexTable.date]: moment(form.createDate).format(TIMESTAMP_FORMAT),
      [dataIndexTable.type]: form.type.title,
      [dataIndexTable.id]: form.id,
    }));
  };

  const handleDownloadForm = async (formId) => {
    const form = (await formService.getFormById(formId).catch((err) => {}))
      ?.data;
    const formFile = (
      await formService.getFormFileByFormId(form?.id).catch((err) => {})
    )?.data;
    if (form && formFile) {
      uploadSerivce
        .download('form', formFile.code, {
          responseType: 'blob',
        })
        .then((response) => {
          //get filename from header
          const disposition = response.headers['content-disposition'];
          const filename = getFileNameFromHeaderDisposition(disposition);
          const a = document.createElement('a');
          const url = URL.createObjectURL(response.data);
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        })
        .catch((err) => {
          console.log(err);
          message.error('File không tồn tại');
        });
    } else message.error('File không tồn tại');
  };

  const tableColumn = [
    {
      title: 'Tên biểu mẫu',
      dataIndex: dataIndexTable.name,
      width: '45%',
      render: (text, record) => <Link>{text}</Link>,
    },
    {
      title: 'Loại',
      width: '20%',
      dataIndex: dataIndexTable.type,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: dataIndexTable.date,
    },
    {
      align: 'center',
      title: 'Hành động',
      render: (_, record) => {
        return (
          <Button
            size="middle"
            type="primary"
            onClick={() => handleDownloadForm(record[dataIndexTable.id])}
          >
            <DownloadOutlined
              style={{
                fontSize: antdIconFontSize,
              }}
            />
            Tải xuống
          </Button>
        );
      },
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    console.log();
  };
  const paginationProps = {
    current: dataPaging.current,
    pageSize: dataPaging.pageSize,
    total: dataPaging.totalElements,
    onChange: (page, pageSize) => {
      dispatch({
        type: 'PAGE_CHANGE',
        current: page,
        pageSize: pageSize,
      });
    },
  };
  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {},
  };
  useEffect(() => {
    console.log('formfilelist render');
  });
  useEffect(() => {
    console.log('formlist call api');
    const callApi = async () => {
      setLoading(true);
      const pageResponse = (
        await uploadSerivce.getAllForm(
          dataPaging.current - 1,
          dataPaging.pageSize
        )
      )?.data;
      dispatch({
        type: 'FETCH',
        totalElements: pageResponse.totalElements,
        pageSize: pageResponse.size,
        tableData: generateTableData(pageResponse?.content ?? []),
      });
      setLoading(false);
    };
    callApi();
  }, [dataPaging.current]);
  return (
    <>
      <Divider>Danh sách biểu mẫu</Divider>
      <Spin spinning={loading}>
        <Table
          bordered
          rowSelection={rowSelection}
          columns={tableColumn}
          dataSource={dataPaging?.tableData}
          pagination={paginationProps}
        />
      </Spin>
    </>
  );
}

export default FormFileList;
