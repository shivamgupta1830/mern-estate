import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const params = useParams();
  const listingID = params.listingID;

  useEffect(() => {
    const fetchListing = async () => {
      const response = await fetch(`/api/listing/get/${listingID}`);
      const data = await response.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, [listingID]);

  const handleImagesUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageUploading(true);
      setImageUploadError(false);

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            //   concat to keep initial images in array
            imageUrls: prevFormData.imageUrls.concat(urls),
          }));
          setImageUploadError(false);
          setImageUploading(false);
        })
        .catch((error) => {
          setImageUploadError(
            "Image upload failed (max allowed size per image is 2 MB)"
          );
          setImageUploading(false);
        });
    } else {
      setImageUploadError("You can only upload max 6 images per listing");
      setImageUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",

        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },

        (error) => {
          reject(error);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageDelete = (index) => {
    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   imageUrls: prevFormData.imageUrls.filter((_, i) => i !== index),
    // }));

    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return setError("You must upload at least one image");
      }
      if (+formData.regularPrice < +formData.discountedPrice) {
        return setError("Discounted price must be less than regular price");
      }
      setLoading(true);
      setError(false);

      const response = await fetch(`/api/listing/update/${listingID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data.updatedListing._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-semibold text-center my-5">
        Update Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />

              <span>Rent</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking === true}
              />
              <span>Parking spot</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished === true}
              />
              <span>Furnished</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer === true}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 ">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="20"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Bathrooms</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />

              <div className="flex flex-col items-center gap-2">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min="0"
                  max="1000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                />

                <div className="flex flex-col items-center gap-2">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className=" flex flex-col flex-1 gap-4">
          <p className="font-semibold">Images:</p>
          <span className="font-normal text-gray-600">
            The first image will be the cover (max 6 images)
          </span>
          <div className="flex gap-4">
            {/* Images */}

            <input
              type="file"
              accept="image/*"
              id="images"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              className="p-3 text-white border bg-green-700 rounded uppercase hover:bg-green-800 disabled:opacity-50"
              onClick={handleImagesUpload}
              type="button"
              disabled={imageUploading}
            >
              {imageUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                className="flex justify-between p-3 items-center border"
                key={index}
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-24 h-24 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(index)}
                  className="text-red-700 rounded-lg hover:text-red-800 p-3 text-sm uppercase font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            className="uppercase p-3 rounded-lg bg-slate-700 text-white hover:bg-slate-800 disabled:opacity-50 "
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          {error && (
            <p className="text-red-700 text-sm font-semibold">{error}</p>
          )}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
