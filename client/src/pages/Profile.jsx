import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>

      <form className="flex flex-col gap-4">
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
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800">
          Update
        </button>
      </form>

      <div className="flex justify-between items-center mt-5">
        <span className="text-red-700 cursor-pointer hover:underline hover:underline-offset-1  font-semibold">
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer hover:underline hover:underline-offset-1 font-semibold">
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default Profile;
