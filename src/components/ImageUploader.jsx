function ImageUploader({ image, setImage }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
    }
  }

  return (
    <div className="mb-4">
      <button
  className="border border-white rounded-full w-10 h-10 flex items-center justify-center bg-transparent hover:bg-white/10"
>
  +
</button>
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