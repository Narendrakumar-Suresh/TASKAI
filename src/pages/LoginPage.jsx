import {
  Card,
  CardBody,
  Input,
  Button,
  Divider,
  Link,
} from "@nextui-org/react";
import { supabase } from "../lib/helper/supabaseClient";
import Password from "../components/Password";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  console.log(formData);

  function handleChange(event) {
    setformData((prevFormData) => {
      return { ...prevFormData, [event.target.name]: event.target.value };
    });
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error(error);
    } else {
      navigate("/");
    }
  }

  async function signInWithEmail() {
    // Basic client-side validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");

      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.status === 429) {
          alert("Too many login attempts. Please try again later.");
        } else {
          alert(error.message || "Login failed. Please try again.");
        }
      } else {
        alert("Login successful!");
        navigate("/"); // Redirect to the home page or app after login
      }
      console.log(data);
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Card className="z-50 m-3 p-3">
        <div className="flex justify-center items-center">
          <h1 className="font-black text-lg">Login</h1>
        </div>
        <CardBody>
          <div className="flex p-2 m-5 flex-wrap md:flex-nowrap gap-4">
            <Input
              type="email"
              size="sm"
              label="Email"
              name="email"
              onChange={handleChange}
            />
            <Password
              label="Password"
              name="password"
              onChange={handleChange}
            />
          </div>
          <div className="flex p-2 m-5 flex-wrap md:flex-nowrap gap-4 justify-center">
            <Button
              size="sm"
              color="primary"
              className="w-fit flex justify-center items-center"
              variant="ghost"
              onClick={signInWithEmail} // Keep the original function name here
            >
              <p className="font-bold text-lg justify-center items-center">
                Log In
              </p>
            </Button>
          </div>
          <Divider className="my-4" />
          <div className="flex p-2 m-5 flex-wrap md:flex-nowrap gap-4 justify-center">
            <Button
              size="sm"
              color="primary"
              className="w-fit flex justify-center items-center"
              variant="ghost"
              onClick={signInWithGoogle}
            >
              <p className="font-bold text-lg justify-center items-center">
                Sign in with Google
              </p>
            </Button>
          </div>
        </CardBody>
        <div className="flex flex-row justify-center items-center">
          <h2>
            Dont have an account?
            <Link color="primary" href="/register">
              Click Here
            </Link>
          </h2>
        </div>
      </Card>
    </div>
  );
}
