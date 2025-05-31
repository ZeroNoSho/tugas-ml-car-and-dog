"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [resultImage, setResultImage] = useState(null);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedImage(null);
  };

  const submitImage = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      const imageBlob = response.data;
      setResultImage(URL.createObjectURL(imageBlob));
      setShowModal(true);
    } catch (error) {
      console.error("API Error:", error);
      alert("Error occurred while sending the image.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[600px] relative border border-gray-300 bg-gray-100 rounded-lg">
        {/* Preview Gambar Upload */}
        <div
          className={`relative order-first min-h-[350px] md:order-last h-28 md:h-auto flex justify-center items-center border border-dashed border-gray-400 col-span-2 m-2 rounded-lg bg-no-repeat bg-center bg-origin-padding bg-cover ${
            imagePreview ? "" : "bg-gray-100"
          }`}
          style={{
            backgroundImage: imagePreview ? `url(${imagePreview})` : "",
          }}
        >
          {!imagePreview && (
            <span className="text-gray-400 opacity-75">
              <svg
                className="w-14 h-14"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="0.7"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </span>
          )}
        </div>

        <div className="rounded-l-lg p-4 bg-gray-200 flex flex-col justify-center items-center border-0 border-r border-gray-300">
          {!imagePreview && (
            <label className="cursor-pointer hover:opacity-80 inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700">
              Select Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </label>
          )}

          {imagePreview && (
            <button
              onClick={submitImage}
              className="cursor-pointer hover:opacity-80 inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700"
            >
              Submit Image
            </button>
          )}

          <button
            onClick={removeImage}
            className="inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700"
          >
            Remove Image
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-xl"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4 text-black">
              Result Image
            </h2>
            <img src={resultImage} alt="Result" className="w-full rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
