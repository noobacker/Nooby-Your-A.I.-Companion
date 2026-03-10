import React, { useState } from "react";
import Drag from "./asset/images/drag.svg";


const Dropzone = ({ onUpload })  => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = () => {
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = async   (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    await onUpload(files);
  };

  return (
    <div className="w-[80%]">
      <div
      className={`flex justify-center items-center w-full py-10 border-4 border-dashed rounded-xl p-5
        ${isDragActive ? "bg-sky-50 border-sky-400" : "border-gray-300"}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <p
        className={`text-lg ${
          isDragActive ? "text-sky-800" : "text-gray-400"
        }  `}
      >
        {isDragActive
          ? "Leave Your File Here"
          : 
          (
            <div className="flex flex-col mx-auto justify-center items-center gap-5">
              <img src={Drag} alt="drag" className="w-[50%] h-[50%]" />
              <p>Drag and drop your files here</p>
            </div>
          )
          }
      </p>

    </div>
    </div>

  );
};

export default Dropzone;