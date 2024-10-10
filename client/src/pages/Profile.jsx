import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import {
  updateSuccess,
  updateStart,
  updateFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutStart,
  signoutFailure,
  signoutSuccess,
  signInFailure,
} from "../redux/user/userSlice";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  const [formData, setFormData] = useState({});
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState(false);

  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;

    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // uploadTask.on("state_changed", (snapshot) => {
    //   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //   setFilePercent(Math.round(progress));
    // });

    // (error) => {
    //   setFileUploadError(true);
    // };

    // () => {
    //   getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //     setFormData({ ...formData, profilePicture: downloadURL });
    //   });
    // };

    // CHAT-GPT the Difference between setFormData

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },

      (error) => {
        // Handle error
        setFileUploadError(true);
      },

      () => {
        // Handle successful upload
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            profilePicture: downloadURL,
          }));
        });
      }
    );
  };

  const handleChange = (e) => {
    // setFormData({ ...formData, [e.target.id]: e.target.value });
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateStart());

      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success === false) {
        dispatch(updateFailure(data.message));
        return;
      }

      dispatch(updateSuccess(data));
      setUpdateSuccessMessage(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signoutStart());

      const response = await fetch("/api/auth/signout");

      const data = await response.json();

      if (data.success === false) {
        dispatch(signoutFailure(data.message));
        return;
      }

      dispatch(signoutSuccess(data));
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const showListings = async () => {
    try {
      setShowListingsError(false);
      const response = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await response.json();

      if (data.success === false) {
        showListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingID) => {
    try {
      const response = await fetch(`/api/listing/delete/${listingID}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingID)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="profile-picture"
          className="rounded-full  object-cover cursor-pointer size-20 mt-1 self-center"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error image upload (image must be less than 2 MB)
            </span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-blue-700 ">{`Uploading ${filePercent}%`}</span>
          ) : filePercent === 100 ? (
            <span className=" text-green-700">Successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          defaultValue="***********"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800"
          disabled={loading}
        >
          {loading ? "Updating...." : "Update"}
        </button>

        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:bg-green-800"
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between items-center mt-5">
        <span
          className="text-red-700 cursor-pointer hover:underline hover:underline-offset-1  font-semibold"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span
          className="text-red-700 cursor-pointer hover:underline hover:underline-offset-1 font-semibold"
          onClick={handleSignout}
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 text-center mt-5">{error ? error : ""}</p>
      <p className="text-green-700 text-center mt-5">
        {updateSuccessMessage ? "Successfully updated!" : ""}
      </p>
      <button
        className="text-indigo-700 text-center w-full font-semibold mt-6 hover:underline hover:underline-offset-2 "
        onClick={showListings}
      >
        Show listings
      </button>
      <p className="text-red-700 text-center mt-4">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-2xl mt-5 font-semibold">
            Your Listings
          </h1>
          {userListings.map((listItem) => (
            <div
              key={listItem._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4 hover:shadow-lg"
            >
              <Link to={`/listing/${listItem._id}`}>
                <img
                  src={listItem.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listItem._id}`}
              >
                <p>{listItem.name}</p>
              </Link>

              <div className="flex flex-col items-center text-sm font-semibold gap-2">
                <button
                  onClick={() => handleListingDelete(listItem._id)}
                  className="text-red-700 uppercase hover:underline"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listItem._id}`}>
                  <button className="text-green-700 uppercase hover:underline">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
