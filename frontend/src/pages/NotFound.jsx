import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center text-gray-600">
      <div className="flex items-center gap-6 rounded-xl text-center">
        <div>
          <h1 className="text-6xl font-bold text-[#25406A]">404</h1>
          <p className="mt-2 text-lg">Page Not Found</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-gradient-to-l from-slate-900 to-blue-900 px-4 py-2 text-white transition hover:opacity-90"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
