import {
  Card,
  CardBody,
  Input,
  Button,
  Divider,
  Link,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import Password from "../components/Password";
import { supabase } from "../lib/helper/supabaseClient";
import { useState } from "react";
export default function Register() {
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

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
    }
    navigate("/");
  }

  async function signUpNewUser() {
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.status === 429) {
          alert("Too many signup attempts. Please try again later.");
        } else {
          alert(error.message || "Registration failed. Please try again.");
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  }

  function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior
    signUpNewUser();
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Card className="z-50 m-3 p-3">
        <div className=" flex justify-center items-center">
          <h1 className="font-black text-lg">Register</h1>
        </div>
        <CardBody>
          <form>
            <div className="flex p-2 m-5 flex-wrap md:flex-nowrap gap-4">
              <Input
                type="email"
                size="sm"
                name="email"
                label="Email"
                onChange={handleChange}
              />
              <Password
                label="Password"
                name="password"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-row justify-center p-2">
              <Button
                size="sm"
                type="submit"
                color="primary"
                className="w-fit flex justify-center items-center"
                variant="ghost"
                onClick={handleSubmit}
              >
                <p className="font-bold text-lg justify-center items-center">
                  Register
                </p>
              </Button>
            </div>
          </form>

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
                Sign up with Google
              </p>
            </Button>
          </div>
        </CardBody>
        <div className="flex flex-row justify-center items-center">
          <h2>
            Already have a account?
            <Link color="primary" href="/login">
              Click Here
            </Link>
          </h2>
        </div>
      </Card>
    </div>
  );
}
