import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { AppBar, Button } from '@mui/material';
import  { TextField } from '@mui/material';
import apiUrlMapping from '../Resources/apiMapping.json'
import { DataGrid } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid-pro';
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';

const PostalCodes =()=>{
    const pledgerTable = 
  [
    {
      field: 'name',
      headerName: 'Name',
      width : 190
    },
    {
      field: 'avg_wattCapacity',
      headerName: 'Average Watt Capacity',
      width : 190
    },
    {
      field: 'max_wattCapacity',
      headerName: 'Maximum Watt Capacity',
      width : 190
    },
    {
        field: 'min_wattCapacity',
        headerName: 'Minimum Watt Capacity',
        width : 190
    },
    {
        field: 'count',
        headerName: 'Count',
        width : 190
    },

  ]

  const [rows, setRows] = useState([])
  const [start,setStart] = useState("")
  const [end,setEnd] = useState("")

  const getRowsWithId = (rows) => {
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


  // Retrieve All Records from Database
  const getAllRecords=(start,end)=>
  {
    axios.get(apiUrlMapping.pledgerData.findPostCodesBetween+start+"/"+end).then(response =>
	{
        console.log(response)
    setRows(getRowsWithId(response.data))
    });
  }

  
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Link to={"/powerLedger"} style={{ textDecoration: "none", color: "white" }}>
            <Typography variant="h6" component="div" sx={{ mr: 2 }}>
              Power Ledger
            </Typography>
          </Link>
          <Link to={"/postalcodes"} style={{ textDecoration: "none", color: "white" }}>
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
        <h1>Data By Postal Codes</h1>
      </div>
      <Grid container spacing={2} m={2}>
        <Grid item xs={0}>
          <TextField size="small" value={start} onChange={(e) => setStart(e.target.value)} label="Start" id="start" />
        </Grid>
        <Grid item xs={2}>
          <TextField size="small" value={end} label="End" onChange={(e) => setEnd(e.target.value)} id="end" />
        </Grid>
        <Grid item xs={1} style={{ display: "flex", alignItems: "center" }}>
          <Button variant="contained" onClick={() => getAllRecords(start, end)}>
            Search
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: "50vh", width: "100%" }}>
            <DataGrid 
            rows={rows} 
            columns={pledgerTable} 
            components={{ Toolbar: GridToolbar }} 
            componentsProps= {{toolbar: { showQuickFilter: true }}} 
            pageSize={5} rowsPerPageOptions={[5]} 
            checkboxSelection disableSelectionOnClick />
      </div>
    </div>
  );
}

export default PostalCodes