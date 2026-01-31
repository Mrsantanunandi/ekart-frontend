import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "../axiosWithJwt";
import { toast } from 'sonner'

export default function SignUp() {

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const Navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      // ✅ SUCCESS CASE
      toast.success(res.data.message);
      Navigate("/verify");

    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='flex justify-center items-center min-h-screen bg-blue-300'>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={submitHandler}>
          <CardContent>
            <div className="flex flex-col gap-3">

              <div className='grid gap-2'>
                <Label htmlFor="username">UserName</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="santanu"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>

                <div className='relative'>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? 'text' : 'password'}
                    required
                  />

                  {showPassword ? (
                    <EyeOff
                      onClick={() => setShowPassword(false)}
                      className='w-5 h-5 cursor-pointer text-gray-700 absolute right-5 bottom-2'
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(true)}
                      className='w-5 h-5 cursor-pointer text-gray-700 absolute right-5 bottom-2'
                    />
                  )}
                </div>
              </div>

            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full cursor-pointer bg-blue-700 hover:bg-blue-500 mt-3" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>

            <p className='text-gray-700 text-sm'>
              Already have an Account?
              <Link to="/login" className='hover:underline ml-1 text-blue-800'>
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
