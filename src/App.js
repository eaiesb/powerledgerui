import './App.css';
import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
import  { TextField } from '@mui/material';
import apiUrlMapping from './Resources/apiMapping.json'
import { DataGrid } from '@mui/x-data-grid';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogActions } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid-pro';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DialogTitle } from '@mui/material'


const geRowsWithId = (rows) => {
  let id = 0
  let completeRowListArray = []
  for (let row of rows) {
    const rowsWithId = {
      id: id,
      ...row
    }
    id++
    completeRowListArray.push(rowsWithId)
  }
  return completeRowListArray
}
export default function App() {

  const powerledgerTable = 
  [
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      getActions: (event) => [
        <GridActionsCellItem  onClick={(e) => editRecord(event)} icon={<EditIcon />} label="Edit" />,
        <GridActionsCellItem  onClick={(e) => deleteRecord(event.id)} icon={<DeleteIcon />} label="Delete" />,
      ],
  },
    {
      field: 'subUrbName',
      headerName: 'SubUrb Name',
      width : 190
    },
    {
      field: 'postalCode',
      headerName: 'Postal Code',
      width : 190
    }
  ]

  const [rows, setRows] = useState([])
  const [addOrEdit, setAddOrEdit] = useState("")
  const [editId, setEditId] = useState("")
  const [open, setOpen] = useState(false);
  const [suburbName, setSubUrbName] 	= useState("");
  const [postalcode, setPostalCode] 	= useState("");
  const handleClose = () => {setOpen(false);};
  const handleClickOpen = () => {setOpen(true);};

  // Retrieve All Records from Database
  const getAllRecords=()=>
  {
    axios.get(apiUrlMapping.powerledgerData.getAll).then(response =>
	{
    setRows(geRowsWithId(response.data))
    });
  }

  const saveRecord = () => 
  {
    setAddOrEdit("Save")
    setPostalCode("");
    setSubUrbName("");
    handleClickOpen()
  }

  useEffect(() => {getAllRecords()}, []);

  const addOrEditRecordAndClose = (type) => 
  {
    if (type === "Edit") {editRecordAndClose()}
    if (type === "Save") {addRecordAndClose() }
  }

  const addRecordAndClose = () => 
  {
    if (suburbName !== undefined && postalcode !== undefined)
	{
      let payload = 
	    { 
        "subUrbName": suburbName,
        "postalCode": postalcode
      }
      axios.post(apiUrlMapping.powerledgerData.post, payload).then(response => 
	  {
	      getAllRecords()
        handleClose()
      })
    }
  }

  // Deleting the record

  const deleteRecord = (index) =>
  {
    let dataId = rows[index]._id
    axios.delete(apiUrlMapping.powerledgerData.delete + "/" + dataId).then(()=>{getAllRecords();});
  }

  const editRecord = (e) => 
  {
    setAddOrEdit("Edit")
    let editRecord = rows[e.id]
    setSubUrbName(editRecord.subUrbName)
    setPostalCode(editRecord.postalCode)
    setEditId(editRecord._id)
    handleClickOpen()
  }

  const editRecordAndClose = () => 
  {
    if (suburbName !== undefined && postalcode !== undefined) {
      let payload = 
      {
        "subUrbName": suburbName,
        "postalCode": postalcode,
      }
      axios.put(apiUrlMapping.powerledgerData.put + "/" + editId, payload).then(response => 
        {
          getAllRecords();
          handleClose();
        })
    }
  }

  
  return (
    <div className="App">
      <div className="text-alligned">
        <h1>powerledger Data</h1>
      </div>
      <div style={{ height: "50vh", width: "100%" }}>
      <DataGrid
          rows = {rows}
          columns = {powerledgerTable}
          components={{Toolbar: GridToolbar,}}
          componentsProps={{toolbar: { showQuickFilter: true }}}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
  </div>
  <div className="center" >
        <Button variant="contained" onClick={saveRecord} >Add Record</Button>
  </div>

  <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save powerledger Data</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="subUrbName"  onChange={(e) => { setSubUrbName(e.target.value) }}value={suburbName}label="SubUrb Name"type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="postalCode" onChange={(e) => { setPostalCode(e.target.value) }}value={postalcode} label="Postal Code" type="text" fullWidth/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => { addOrEditRecordAndClose(addOrEdit) }}>Save</Button>
        </DialogActions>
  </Dialog>
    </div>
  );
}