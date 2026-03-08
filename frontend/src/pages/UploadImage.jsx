import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import "../App.css";

function UploadImage() {

  const [images, setImages] = useState([]);

  const handleUpload = (event) => {
    const files = Array.from(event.target.files);

    const imageUrls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  const handleDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  return (
    <div className="upload-container">

      {/* Upload Button */}
      <label className="upload-btn">
        Upload
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          hidden
        />
      </label>

      {/* Image Grid */}
      <div className="preview-container">

        {images.map((img, index) => (

          <div key={index} className="image-card">

            <img
              src={img}
              alt="preview"
              className="upload-image"
            />

            {/* Delete Button */}
            <button
              className="delete-icon"
              onClick={() => handleDelete(index)}
            >
              <Trash2 size={18} />
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default UploadImage;