import { FaSearch } from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl m-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-lg flex flex-wrap">
            <span className="text-slate-500">Shivam</span>
            <span className="text-slate-00">Estate</span>
          </h1>
        </Link>

        <form
          className="bg-slate-100 p-3 rounded-lg flex items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64 "
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button>
            {" "}
            <FaSearch className="text-slate-600" />
          </button>
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
