function ImageUploader({ image, setImage }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
    }
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 text-white">Upload Image (optional)</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-white"
      />
      {image && (
        <img src={image} alt="Uploaded" className="mt-2 max-h-48 rounded" />
      )}
    </div>
  )
}

export default ImageUploader