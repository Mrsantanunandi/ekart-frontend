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
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'

export default function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const Navigate = useNavigate()
  const dispatch= useDispatch()

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
        `${import.meta.env.VITE_URL}/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.success) {
        //Save JWT automatically
        localStorage.setItem("token", res.data.token);
        toast.success(res.data.message);
        Navigate("/");
        //console.log(res.data.user)

        dispatch(setUser(res.data.user))
      } else {
        toast.error(res.data.message || "Login Failed");
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className='flex justify-center items-center min-h-screen bg-blue-300'>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your details to login your account
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
                  placeholder="Enter Your Username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>

                <div className='relative'>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Enter Your Password"
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
              {loading ? "Login..." : "login"}
            </Button>

            <p className='text-gray-700 text-sm'>
              Don't have an Account?
              <Link to="/signup" className='hover:underline ml-1 text-blue-800'>
                SignUp
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
