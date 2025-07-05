import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-hot-toast";

export function SignUpForm({
  className,
  onToggleForm,
  ...props
}: React.ComponentProps<"form"> & { onToggleForm: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useAuthStore();
  
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      window.location.href = "/home";
    }
  }, [user]);

  const validateUsername = (username: string) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords don't match";
    return "";
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError("");

    const usernameValidationError = validateUsername(username);
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const confirmPasswordValidationError = validateConfirmPassword(confirmPassword, password);

    setUsernameError(usernameValidationError);
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmPasswordValidationError);

    if (!usernameValidationError && !emailValidationError && !passwordValidationError && !confirmPasswordValidationError) {
      try {
        await register(username, email, password);
        toast.success("Registration successful");
        window.location.href = "/home";
      } catch (error) {
        setGeneralError("Registration failed. Please try again.");
        toast.error("Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to create your account
        </p>
      </div>
      <div className="grid gap-6">
        {generalError && (
          <div className="text-red-600 text-sm text-center">{generalError}</div>
        )}
        
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            type="text"
            placeholder="johndoe"
            required
            value={username}
            aria-invalid={!!usernameError}
            aria-describedby={usernameError ? "username-error" : undefined}
          />
          {usernameError && (
            <span id="username-error" className="text-xs text-red-600">{usernameError}</span>
          )}
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && (
            <span id="email-error" className="text-xs text-red-600">{emailError}</span>
          )}
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            required
            value={password}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : undefined}
            autoComplete="new-password"
          />
          {passwordError && (
            <span id="password-error" className="text-xs text-red-600">{passwordError}</span>
          )}
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            aria-invalid={!!confirmPasswordError}
            aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
            autoComplete="new-password"
          />
          {confirmPasswordError && (
            <span id="confirm-password-error" className="text-xs text-red-600">{confirmPasswordError}</span>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
        
        <div className="text-center text-sm">
          Already have an account?{" "}
          <button 
            type="button"
            onClick={onToggleForm}
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
}