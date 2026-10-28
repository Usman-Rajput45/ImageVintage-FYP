import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReusableInput } from "../components/Form";
import { APP_NAME } from "../config/app";
import { signup } from "../store/slices/authSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values) => {
    const result = await dispatch(
      signup({
        fullName: values.name,
        email: values.email,
        password: values.password,
      })
    );

    if (result.success) {
      navigate("/", { replace: true });
    }
    // On failure, auth.error (Redux state) drives the inline error message below.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6">
      <div className="w-full max-w-md sm:max-w-lg rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Create account — {APP_NAME}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-gray-900 hover:underline">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <ReusableInput
            label="Name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />
          <ReusableInput
            label="Email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            })}
          />
          <ReusableInput
            type="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Min 8 characters" },
            })}
          />
          {auth.error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {auth.error}
            </p>
          )}

          <button
            type="submit"
            disabled={auth.loading}
            className="h-11 w-full rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {auth.loading ? "Creating…" : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
