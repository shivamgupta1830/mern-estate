import { useSelector } from "react-redux";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.profilePicture}
          alt="profile-picture"
          className="rounded-full  object-cover cursor-pointer size-20 mt-1 self-center"
        />
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
