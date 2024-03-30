import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import axios from "axios";
import { saveAs } from "file-saver";
import { URL } from "./helper/helper.js";
import { toast } from "react-hot-toast";

function PdfComponent({pdfFile,fileData}) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedPages, setSelectedPages] = useState([]);
  const [download, setDownload] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  function onDocumentLoadSuccess({numPages}){
    setNumPages(numPages);
  }

  const handleCheck = (e) => {
    e.preventDefault();
    console.log("hi");
    if (e.target.checked) {
      setSelectedPages((selectedPages) => {
        if (selectedPages.includes(e.target.value)) {
          return selectedPages
        } else {
          return [...selectedPages, e.target.value];
        }
      }
      );
    } else {
      const filteredPages = selectedPages.filter((page) => page !== e.target.value);
      setSelectedPages(filteredPages);
    }
  }


  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        selectedPages: selectedPages,
        filePath: `files/${fileData}`,
        pdfFile:fileData
      }
      if (selectedPages) {
        const res = await axios.post(
          `${URL}/generate-pdf`,
          data
        );
        setLoading(false);
        if (res.status === 201) {
          toast.success("New Pdf Generated!")
          setFileName(res.data.pdf);
          setDownload(`${URL}/generated/${res.data.pdf}`);
        }
      } else {
        toast.error("Please select the pages in the pdf");
      }
      
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }

  const downloadFileAtURL = (e) => {
    e.preventDefault();
    saveAs(download);
  }

  return (
    <div className="md:p-12 bg-pink-400 mt-12 rounded ">
      <div className="flex flex-wrap justify-between mb-2 ">
        <p className="text-black">
          Page {pageNumber} of {numPages}
        </p>
        {download ? (
          <button
            className="btn bg-sky-300 text-pink-400 rounded px-1 md:px-4 py-2 font-bold"
            onClick={(e)=>downloadFileAtURL(e)}
          >
            Download Pdf
          </button>
        ) : (
          ""
        )}
        <button
          className="btn  bg-sky-300 rounded  px-1 md:px-4 py-2 font-bold text-pink-500"
          onClick={(e) => handleGenerate(e)}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Generate NewPdf"
          )}
        </button>
      </div>
      <div className="max-w-fit">
        <Document
          file={pdfFile}
          width={window.innerWidth}
          className="text-black"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.apply(null, Array(numPages))
            .map((x, i) => i + 1)
            .map((page) => {
              return (
                <>
                  <div className="flex mb-10 justify-between relative">
                    <Page
                      pageNumber={page}
                      className="w-auto"
                      width={window.innerWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                    <input
                      type="checkbox"
                      value={page}
                      className="bg-transparent absolute top-5  right-5 z-2 bg-sky-300 text-pink-400 md:p-4 w-10 h-10 text-lg mr-4"
                      onChange={(e) => handleCheck(e)}
                    />
                  </div>
                </>
              );
            })}
        </Document>
      </div>
    </div>
  );
}
export default PdfComponent;