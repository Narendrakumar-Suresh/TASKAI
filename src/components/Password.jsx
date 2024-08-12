import React from "react";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../assets/EyeFilledIcon ";
import { EyeSlashFilledIcon } from "../assets/EyeSlashFilledIcon";

export default function Password({ label, name, onChange }) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      label={label}
      variant="bordered"
      fullWidth={true}
      size="sm"
      name={name}
      onChange={onChange}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
    />
  );
}
