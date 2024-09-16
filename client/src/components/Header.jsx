import { FaSearch } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-slate-200 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl m-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-lg flex flex-wrap">
            <span className="text-slate-500">Shivam</span>
            <span className="text-slate-00">Estate</span>
          </h1>
        </Link>

        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64 "
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex justify-center items-center gap-6 font-semibold">
          <NavLink to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              Home
            </li>
          </NavLink>

          <NavLink to="/about">
            {" "}
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              About
            </li>
          </NavLink>

          <NavLink to="/profile">
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile-pic"
                className="rounded-full size-10 object-cover"
              />
            ) : (
              <li className=" text-slate-700 hover:underline cursor-pointer">
                Sign in
              </li>
            )}
          </NavLink>
        </ul>
      </div>
    </header>
  );
}

export default Header;
