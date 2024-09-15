import { Link } from "react-router-dom";

function Signin() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4 ">
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
        <button
          className="text-white bg-slate-700 hover:bg-slate-800 p-3 rounded-lg uppercase cursor-pointer disabled:opacity-50"
          // disabled={true}
        >
          Sign Up
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Not registered yet?</p>
        <Link to="/sign-up">
          <span className="text-blue-700  hover:underline hover:underline-offset-2">
            Sign up
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Signin;
