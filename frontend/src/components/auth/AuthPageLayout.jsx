const AuthPageLayout = ({ children }) => {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 overflow-hidden bg-white lg:grid-cols-3">
      <div className="hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 lg:col-span-2 lg:block" />

      <div className="flex flex-col justify-center p-6 md:p-8 lg:col-span-1">
        {children}
      </div>
    </div>
  );
};

export default AuthPageLayout;
