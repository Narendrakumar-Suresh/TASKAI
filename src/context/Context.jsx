import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import { supabase } from "../lib/helper/supabaseClient"; // Adjust the import as needed

// Create a context
export const Context = createContext();

// Create a provider component
export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user || null);

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return <Context.Provider value={{ user }}>{children}</Context.Provider>;
};

// Define prop types for ContextProvider
ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
