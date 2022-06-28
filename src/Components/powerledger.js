import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { AppBar, Button } from '@mui/material';
import  { TextField } from '@mui/material';
import apiUrlMapping from '../Resources/apiMapping.json'
import { DataGrid } from '@mui/x-data-grid';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogActions } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid-pro';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DialogTitle } from '@mui/material'
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { Link } from 'react-router-dom';


const PowerLedger=()=>{
    const pledgerTable = 
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
      field: 'name',
      headerName: 'Name',
      width : 190
    },
    {
      field: 'postalCode',
      headerName: 'Postal Code',
      width : 190
    },
    {
      field: 'wattCapacity',
      headerName: 'Watt Capacity',
      width : 190
    }
  ]

  const [rows, setRows] = useState([])
  const [addOrEdit, setAddOrEdit] = useState("")
  const [editId, setEditId] = useState("")
  const [open, setOpen] = useState(false);
  const [name, setName] 	= useState("");
  const [postalcode, setPostalCode] 	= useState("");
  const [wattCapacity, setWattCapacity] = useState("");
  const handleClose = () => {setOpen(false);};
  const handleClickOpen = () => {setOpen(true);};


  // Retrieve All Records from Database
  const getAllRecords=()=>
  {
    axios.get(apiUrlMapping.pledgerData.getAll).then(response =>
	{
    setRows(response.data)
    });
  }

  const saveRecord = () => 
  {
    setAddOrEdit("Save")
    setPostalCode("");
    setName("");
    setWattCapacity("");
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
    if (name !== undefined && postalcode !== undefined && wattCapacity !== undefined)
	{
      let payload = 
	    { 
        "name": name,
        "postalCode": postalcode,
        "wattCapacity" : wattCapacity
      }
      axios.post(apiUrlMapping.pledgerData.post, payload).then(response => 
	  {
	      getAllRecords()
        handleClose()
      })
    }
  }

  // Deleting the record

  const deleteRecord = (index) =>
  {
    let dataId = rows.find(element=> element.id=== index)
    axios.delete(apiUrlMapping.pledgerData.delete + "/" + dataId.id).then(()=>{getAllRecords();});
  }

  const editRecord = (e) => 
  {
    console.log(e)
    setAddOrEdit("Edit")
    let editRecord = rows.find(element=>element.id===e.id)
    console.log(rows)
    setName(editRecord.name)
    setPostalCode(editRecord.postalCode)
    setWattCapacity(editRecord.wattCapacity)
    
    setEditId(editRecord.id)
    handleClickOpen()
  }

  const editRecordAndClose = () => 
  {
    if (name !== undefined && postalcode !== undefined) {
      let payload = 
      {
        "name": name,
        "postalCode": postalcode,
        "wattCapacity" : wattCapacity
      }
      axios.put(apiUrlMapping.pledgerData.put + "/" + editId, payload).then(response => 
        {
          getAllRecords();
          handleClose();
        })
    }
  }

  
  return (
    <div className="App">
      <AppBar position="static">
      <Toolbar>
              <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Link to={'/powerLedger'} style={{ textDecoration: 'none', color:"white" }}>
              <Typography variant="h6" component="div" sx={{ mr: 2 }}>
                Power Ledger
              </Typography>
              </Link>
              <Link to={'/postalcodes'} style={{ textDecoration: 'none', color:"white" }}>
              <Typography variant="h6" component="div" sx={{ mr: 2 }}>
                Postal Codes
              </Typography>
              </Link>
              <Link to={"/aggression"} style={{ textDecoration: "none", color: "white" }}>
            <Typography variant="h6" component="div" sx={{ mr: 2 }}>
              Aggression
            </Typography>
          </Link>
            </Toolbar>
      </AppBar>
      <div className="text-alligned">
        <h1>Power Ledger Data</h1>
      </div>
      
      <div style={{ height: "50vh", width: "100%" }}>
      <DataGrid
          rows = {rows}
          columns = {pledgerTable}
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
        <DialogTitle>Save Pledger Data</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="name"  onChange={(e) => { setName(e.target.value) }}value={name}label="Name"type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="postalCode" onChange={(e) => { setPostalCode(e.target.value) }}value={postalcode} label="Postal Code" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="wattCapacity" onChange={(e) => { setWattCapacity(e.target.value) }}value={wattCapacity} label="Watt Capacity" type="text" fullWidth/>
        </DialogContent>
        <DialogActions>
          <Button sx={{backgroundColor: "red"}} onClick={handleClose}>Cancel</Button>
          <Button onClick={() => { addOrEditRecordAndClose(addOrEdit) }}>Save</Button>
        </DialogActions>
  </Dialog>
    </div>
  );
}

export default PowerLedger;
