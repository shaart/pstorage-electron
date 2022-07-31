import { Button } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import { useState } from 'react';
import { Channels, Password, User } from 'shared/constants';

const ipcRenderer = window.electron.ipcRenderer;

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    editable: false,
    minWidth: 140,
  },
  {
    field: 'alias',
    headerName: 'Alias',
    editable: true,
    minWidth: 140,
  },
  {
    field: 'password',
    headerName: 'Password',
    editable: false,
    minWidth: 50,
    maxWidth: 100,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<void>) => (
      <strong>
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          tabIndex={params.hasFocus ? 0 : -1}
        >
          Copy
        </Button>
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          tabIndex={params.hasFocus ? 0 : -1}
        >
          Delete
        </Button>
      </strong>
    ),
  },
];

const Passwords = () => {
  const [userPasswords, setUserPasswords] = useState<Password[]>([]);

  ipcRenderer.on(Channels.GET_CURRENT_USER, (args: User) => {
    console.log(`Got result of \'${Channels.GET_CURRENT_USER}\' event with userId=${args.id} and ${args.passwords.length} passwords`);
    setUserPasswords(args.passwords);
  });

  const userPasswordsToView = (value: Password[]): GridRowsProp => {
    return value.map((arg: Password) => {
      return {
        id: arg.id,
        alias: arg.alias,
        password: '***',
      };
    });
  };

  const passwordsView = userPasswordsToView(userPasswords);
  return (
    passwordsView.length > 0 && (
      <div>
        <DataGrid
              autoHeight={true}
              rows={passwordsView}
              columns={columns}
              rowsPerPageOptions={[5,10,50]}
              checkboxSelection
            />
      </div>
    )
    || !passwordsView.length && (<div>No data</div>)
  );
};
ipcRenderer.sendMessage(Channels.GET_CURRENT_USER, []);

export default Passwords;
