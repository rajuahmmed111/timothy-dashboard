import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import signInIMG from "../../assets/sign-in-image.png";
import { AuthContext } from "../../providers/AuthProvider";
import ContinueGoogle from "../../assets/ContinueGoogle.png";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getUserProfile, loginUser } from "../../redux/features/auth/authSlice";
import { useEffect } from "react";
import { Alert, message } from "antd";
import { Spin } from "antd";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { signIn, signInGoogle, signInFacebook, ForgotPassword } =
    useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const emailRef = useRef();
  const [errorShow, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { token, loading, success, userId, error, user } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");
    // console.log(email, password);
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (token) {
      dispatch(getUserProfile());
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      setShowSuccess(true);
      message.success("Login successful!");
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/"); // or "/login" if needed
      }, 2000);
    } else if (error) {
      message.error(error); // Show the error from Redux
      setError(error); // Optionally store in local state if needed
    }
  }, [user]);


  useEffect(() => {
  if (error) {
    // If error is a string (from thunk), use it directly
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message || "Something went wrong";

    setError(errorMessage);

    const timer = setTimeout(() => {
      setPasswordError("");
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [error]);

  const handleForgotPassword = () => {
    ForgotPassword(emailRef);
    navigate("/forgotpass");
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);

    if (provider === "Google") {
      signInGoogle()
        .then((result) => {
          console.log("Google login successful:", result.user);
          navigate("/");
        })
        .catch((error) => {
          console.error("Google login error:", error);
        });
    }

    if (provider === "Facebook") {
      signInFacebook()
        .then((result) => {
          console.log("Facebook login successful:", result.user);
          navigate("/");
        })
        .catch((error) => {
          console.error("Facebook login error:", error);
        });
    }
  };

  return (
    <div className="relative font-poppins">
      {/* Image - hidden on mobile */}
      <img
        src={signInIMG}
        className="hidden lg:block absolute w-[50rem] h-[50rem] top-0 right-0"
        alt="sign-in-image"
      />

      <div className="absolute left-0 min-h-screen flex items-center container mx-auto px-4 lg:px-0">
        <div className="bg-white mt-[1rem] lg:ml-[15rem] p-8 py-12 lg:py-20 rounded-2xl w-full max-w-md min-h-[40rem] flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-orangeAction">Welcome Back</h2>
          <p className="text-md font-semibold mb-8 text-[#A0AEC0] mt-2">
            Enter your email and password to sign in
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-darkGray">
                Email
              </label>
              <input
                type="email"
                name="email"
                ref={emailRef}
                placeholder="Your email address"
                className="mt-1 w-full px-4 py-4 border text-brandGray rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-darkGray">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Your password"
                  className="mt-1 w-full pr-12 px-4 py-4 border text-brandGray rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-between items-center mt-5  text-sm text-[#ff9000] hover:text-blue-600">
                {/* Toggle Switch */}
                {/* <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-4 bg-gray-300 rounded-full peer-checked:bg-orange-500 transition" />
                    <div className="absolute w-6 h-6 bg-white rounded-full -top-1 left-0 peer-checked:translate-x-full transition shadow" />
                  </div>
                  <span className="ml-3">Remember me</span>
                </label> */}
                <span
                  onClick={handleForgotPassword}
                  className="cursor-pointer hover:underline "
                >
                  Forgot password?
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-orangeAction uppercase text-sm  hover:bg-orange-500 text-white font-semibold py-4 rounded-2xl transition"
            >
              {loading ? <Spin size="small" /> : "Login"}
            </button>
          </form>

          {success && <>login successful</>}

          {errorShow && (
            <div className="my-4">
              <Alert message={errorShow} type="error" showIcon closable />
            </div>
          )}
          {showSuccess && (
            <Alert
              type="success"
              message="Account login successful!"
              description="Welcome back!"
              showIcon
              className="my-4"
            />
          )}

          {/* <p className="text-md font-semibold text-[#A0AEC0] text-center mt-4 mb-3">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-orangeAction font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p> */}

          {/* OR Divider */}
          {/* <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="px-4 text-sm text-brandGray font-semibold">
              or, login with
            </span>
            <div className="flex-grow h-px bg-gray-200" />
          </div> */}

          {/* Social Login Section */}
          {/* <div className="bg-white rounded-lg mb-6">
            <div className="flex justify-center gap-4">
              <div className="border rounded-2xl cursor-pointer hover:bg-grayLightBg">
                <img
                  className="w-full flex items-center justify-center transition-colors"
                  onClick={() => handleSocialLogin("Google")}
                  src={ContinueGoogle}
                  alt="GoogleLogo"
                />
              </div>
            </div>
          </div> */}


        </div>
      </div>
    </div>
  );
};

export default Login;
