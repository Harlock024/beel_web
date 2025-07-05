import { useState } from "react";
import { LoginForm } from "./login-form";
import { SignUpForm } from "./sign-up";
import { motion, AnimatePresence } from "framer-motion";

export function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <LoginForm onToggleForm={toggleForm} />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SignUpForm onToggleForm={toggleForm} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}