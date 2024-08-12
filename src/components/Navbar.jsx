import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../features/auth/authSlice";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button,
  Image,
} from "@nextui-org/react";

import { supabase } from "../lib/helper/supabaseClient";

export default function Navbars() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
    } else {
      localStorage.removeItem("isLoggedIn");
      dispatch(setLoggedIn(false));
      console.log("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <Navbar isBordered className="bg-black" justify="center">
      <NavbarContent justify="start">
        <NavbarBrand>
          <Image
            isBlurred
            src="src/assets/Global_1.jpg"
            height={50}
            radius="full"
            // className="h-12 w-12 rounded-full"
          ></Image>
          <p className="hidden sm:block font-bold text-inherit">TASKAI</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent
        as="div"
        className="hidden sm:flex gap-4"
        justify="center"
      ></NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
        <Button color="danger" variant="bordered" onPress={handleLogout}>
          Log Out
        </Button>
      </NavbarContent>
    </Navbar>
  );
}
