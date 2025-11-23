import { useContext, useState } from "react";
import { Facebook, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createUser, resetUserState } from "../../redux/features/user/userSlice";
import { Alert, message } from "antd";
import { useEffect } from "react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user, signInGoogle, signInFacebook } = useContext(AuthContext);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.user);


  // handleRegister
const handleRegister = (e) => {
  e.preventDefault();

  // Email validation regex (basic but effective)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    setPasswordError("Please enter a valid email address.");
    return;
  }

  if (
    password.length < 6 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password)
  ) {
    setPasswordError(
      "Password must be at least 6 characters long, and include both uppercase and lowercase letters."
    );
    return;
  } else {
    setPasswordError("");
  }

  // Continue registration
  console.log("Registration attempt:", { name, email, password });
  const role = "ADMIN";
  let fullName = name;
  let status = "INACTIVE";
  // Dispatch the createUser action
  dispatch(createUser({ email, password, role, fullName, status }));
};


  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      message.success("Account created successfully. Awaiting admin approval.");

      setTimeout(() => {
        dispatch(resetUserState()); // ✅ reset the Redux state
      }, 1500);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [success, dispatch, navigate]);




useEffect(() => {
  if (error) {
    // If error is a string (from thunk), use it directly
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message || "Something went wrong";

    setPasswordError(errorMessage);

    const timer = setTimeout(() => {
      setPasswordError("");
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [error]);


  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);

    if (provider === "Google") {
      signInGoogle()
        .then((result) => {
          console.log("Google login successful:", result.user);
        })
        .catch((error) => {
          console.error("Google login error:", error);
        });
    }

    if (provider === "Facebook") {
      signInFacebook()
        .then((result) => {
          console.log("Facebook login successful:", result.user);
        })
        .catch((error) => {
          console.error("Facebook login error:", error);
        });
    }
  };

  // console.log(user);
  return (
<div>

        {showSuccess && (
        <Alert
          message="Account created successfully"
          description="Please wait for admin approval."
          type="success"
          showIcon
          closable
        />
      )}
      <div className="min-h-screen mb-32 bg-white relative">


      {/* Top Orange Section */}
      <div className=" relative overflow-hidden py-40">
        <img
          src="https://i.ibb.co/XxTSZFzf/SignUp.png"
          alt="signupimg"
          className="absolute h-full top-0 w-full px-6 py-6"
        />

        <div className="text-center relative z-10">
          <h1 className="text-3xl font-bold text-darkGray mb-2 font-sans">
            Welcome!
          </h1>
          <p className="text-brandGray text-lg font-semibold">
            Create your account to get started
            <br />
            and explore all the features we offer.
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <div className="px-12 py-12 w-[29rem] border rounded-2xl absolute top-72 left-1/2 -translate-x-1/2 bg-white">
        {/* Social Login Section */}
        <div className="bg-white hidden rounded-lg shadow-sm border p-4 mb-6">
          <p className="text-center text-sm text-brandGray mb-4">
            Register with
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <Facebook size={18} className="text-white" />
            </button>

            <button
              onClick={() => handleSocialLogin("Google")}
              className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <span className="text-white font-bold text-sm">G</span>
            </button>
          </div>
        </div>

        {/* OR Divider */}
        {/* <div className="text-center mb-6">
          <span className="text-brandGray text-sm">or</span>
        </div> */}

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-darkGray mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-darkGray mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-darkGray mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full pr-12 px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-600 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {/* Remember Me Toggle */}
          {/* <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-[2.6rem] h-5 rounded-full transition-colors ${
                    rememberMe ? "bg-orange-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`size-5 bg-white rounded-full shadow-inner transform transition-transform ${
                      rememberMe ? "translate-x-6" : "translate-x-0"
                    } mt-1`}
                  ></div>
                </div>
              </div>
              <span className="ml-3 text-sm text-darkGray">Remember me</span>
            </label>
          </div> */}

          <button
            onClick={handleRegister}
            className="w-full bg-orangeAction hover:bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        <p className=" mt-6 text-md font-semibold text-[#A0AEC0] text-center">
          Already have an account?{" "}
          <Link to={`/login`}>
            <span className="text-orange-500 font-medium hover:underline cursor-pointer">
              Sign in
            </span>
          </Link>
        </p>
      </div>
    </div>
</div>
  );
};

export default Register;
