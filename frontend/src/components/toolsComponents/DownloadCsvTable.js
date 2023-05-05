import React from 'react'
import { BiDownload } from "react-icons/bi";

function DownloadCsvTable(props) {

    function downloadCSV() {
        const headers = Object.keys(props.response[0]);
        const data = [headers, ...props.response.map(row => Object.values(row))];
        const csv = data.map(row => row.join(',')).join('\n');
        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        link.target = '_blank';
        link.download = 'Clustering_ok.csv';
        link.click();
      }    

  return (
    <div><button className=' my-6 btn btn-ghost text-[#E5408E] border-[#E5408E]  hover:bg-[#E5408E] hover:text-black' onClick={downloadCSV}>Download CSV</button></div>
  )
}

export default DownloadCsvTable