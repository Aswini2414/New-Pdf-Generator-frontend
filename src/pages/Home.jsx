import React, { useState } from 'react'
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfComponent from "../PdfComponent.js";
import { URL } from "../helper/helper.js";
import { toast } from "react-hot-toast";


const Home = () => {
  const [file, setFile] = useState(" ");
  const [pdfFile, setPdfFile] = useState("");
  const [fileData, setFileData] = useState("");
  const [loading, setLoading] = useState(false);

  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  // new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();
  //`//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
  console.log(file);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      console.log(formData);
      const res = await axios.post(`${URL}/upload-files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      if (res.status === 201) {
        toast.success("File Uploaded successfully!!!");
        let data = res.data;
        setFileData(data.pdf);
        setPdfFile(`${URL}/files/${data.pdf}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };
  console.log(fileData);
  return (
    <div className="App">
      <div className="">
        <form
          className=" flex flex-col flex-wrap border-2 border-solid border-slate-200 py-4 bg-sky-300 rounded w-[90%] max-w-fit ml-auto mr-auto md:px-4 md:py-4 md:w-auto md:max-w-auto "
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl text-bold text-center font-bold mb-5 text-amber-600">
            Upload a pdf
          </h1>
          <input
            type="file"
            accept="application/pdf"
            required
            className="bg-amber-200 rounded p-2 text-black w-[90%] ml-auto mr-auto"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <br />
          <button className="btn btn-block btn-md bg-pink-400 text-white text-xl ">
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
        <PdfComponent pdfFile={pdfFile} fileData={fileData} />
      </div>
    </div>
  );
}
// bg-red-300 rounded px-4 py-2 font-bold text-lg max-w-[200px] ml-auto mr-auto text-green-800

export default Home