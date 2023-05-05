import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


function TextEditor({ content, setContent }) {
  const [showHtml, setShowHtml] = useState(false);

  function handleContentChange(value) {
    setContent(value);
  }

  function handleToggleHtml() {
    setShowHtml(!showHtml);
  }



  return (
    <div className="bg-transparent" >
      <ReactQuill
        value={content}
        onChange={handleContentChange}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
          ],
        }}
      />
      {/* <button onClick={handleCopy}>Copiar al portapapeles</button> */}
    </div>
  );
}

export default TextEditor;
