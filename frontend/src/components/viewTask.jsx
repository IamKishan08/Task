import React, { useEffect, useState } from 'react';
import './assests/css/viewTask.css';
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import axios from '../api';

const columnHelper = createMRTColumnHelper();

const columns = [
  columnHelper.accessor('sno', { header: 'S.No', size: 40 }),
  columnHelper.accessor('cusName', { header: 'Customer Name', size: 120 }),
  columnHelper.accessor('hostName', { header: 'Host Name', size: 120 }),
  columnHelper.accessor('os', { header: 'OS', size: 120 }),
  columnHelper.accessor('pubIpAddr', { header: 'Public IP Address', size: 120 }),
  columnHelper.accessor('priIpAddr', { header: 'Private IP Address', size: 120 }),
  columnHelper.accessor('groupName', { header: 'Group Name', size: 120 }),
  columnHelper.accessor('location', { header: 'Location', size: 120 }),
  columnHelper.accessor('scheduleDate', { header: 'Schedule Date', size: 120 }),
  columnHelper.accessor('scheduleTime', { header: 'Schedule Time', size: 120 }),
  columnHelper.accessor('status', { header: 'Status', size: 120 }),
];

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const ViewTask = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('schedule/get_schedules');
        console.log(response.data); // Check the response data structure

        // Accessing the schedules array
        const tasks = response.data.schedules; // Adjusted to access 'schedules'
        
        if (Array.isArray(tasks)) {
          const formattedData = tasks.map((task, index) => ({
            sno: index + 1,
            cusName: task.owner_name,
            hostName: task.server_details.host_name,
            os: task.server_details.operating_system,
            pubIpAddr: task.server_details.public_ip_address,
            priIpAddr: task.server_details.private_ip_address,
            groupName: task.server_details.group,
            location: task.server_details.location,
            scheduleDate: task.schedule_date,
            scheduleTime: `${task.start_time} - ${task.end_time}`,
            status: task.status,
          }));
          setData(formattedData);
        } else {
          console.error('Expected an array from API, but got:', tasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default ViewTask;
