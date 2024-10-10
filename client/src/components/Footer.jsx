function Footer() {
  return (
    <footer className="w-full bg-slate-700 p-[12px] mx-auto">
      <h1 className="font-semibold text-md sm:text-lg flex flex-wrap justify-center items-center">
        <span className="text-slate-300">Estate</span>
        <span className="text-white">Hub</span>
        <span className="text-white"> &copy;</span>
        <span className="text-white ">{new Date().getFullYear()}</span>
      </h1>
    </footer>
  );
}

export default Footer;
