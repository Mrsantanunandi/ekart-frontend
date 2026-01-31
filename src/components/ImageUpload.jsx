import React, { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

const ImageUpload = ({ productData = {}, setProductData }) => {
  const fileInputRef = useRef();
  const [error, setError] = useState("");

  const images = productData.images || [];

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setError("You can upload maximum 5 images");
      toast.error("You can upload maximum 5 images");
      return;
    }

    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (!validFiles.length) {
      setError("Please select valid image files");
      toast.error("Please select valid image files");
      return;
    }

    setProductData({
      ...productData,
      images: [...images, ...validFiles],
    });

    setError("");
    e.target.value = null;
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setProductData({ ...productData, images: updatedImages });
    if (updatedImages.length < 5) setError("");
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img instanceof File) URL.revokeObjectURL(img);
      });
    };
  }, [images]);

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-700">
        Product Images
      </label>

      <div className="flex flex-wrap gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative w-24 h-24 border border-gray-300 rounded-lg overflow-hidden"
          >
            <img
              src={img instanceof File ? URL.createObjectURL(img) : img.url}
              alt={`preview-${idx}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-600 transition"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {images.length < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="w-24 h-24 border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center text-gray-500 hover:border-pink-600 hover:text-pink-600 transition"
          >
            <span className="text-3xl">+</span>
            <span className="text-xs text-center">Upload</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFilesChange}
        multiple
        accept="image/*"
        className="hidden"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <p className="text-xs text-gray-500">
        You can upload up to 5 images. Supported formats: JPG, PNG.
      </p>
    </div>
  );
};

export default ImageUpload;

