"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/userApi";
import { UserResponse } from "@/types/user";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError("");

    if (!formData.identifier || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const user: UserResponse = await loginUser({
        email: formData.identifier,
        password: formData.password,
      });

      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setError("Something went wrong. Please try again.");
        return;
      }

      console.log("✅ Login success:", user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-40px)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Username or Email</Label>
            <Input
              id="identifier"
              name="identifier"
              placeholder="your@email.com"
              onChange={handleChange}
              value={formData.identifier}
              disabled={loading}
            />
          </div>
          <div className="space-y-2 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              onChange={handleChange}
              value={formData.password}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-muted-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
        <div className="text-sm text-center mt-2 mb-5">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-white font-medium underline"
            disabled={loading}
          >
            Register here
          </button>
        </div>
      </Card>
    </div>
  );
}
