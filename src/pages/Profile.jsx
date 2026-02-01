import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import UserLogo from "../assets/UserLogo.jpg";
import axios from "../axiosWithJwt";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import MyOrder from "./MyOrder";

export default function Profile() {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id;

  const [updateUser, setUpdateUser] = useState({
    username: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    profilePic: "",
    role: "",
  });

  const [file, setFile] = useState(null);

  // Populate initial data when user loads
  useEffect(() => {
    if (user) {
      setUpdateUser({
        username: user.username || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        address: user.address || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
        profilePic: user.profileImageUrl || "", // backend field
        role: user.role || "",
      });
    }
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  // Handle profile picture change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile), // preview immediately
    });
  };

  // Submit updated profile

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard clause to prevent "undefined" in URL
  if (!user?.id && !id) {
    toast.error("User ID missing. Try logging in again.");
    return;
   }
    try {
      const payload = {
        username: updateUser.username,
        phoneNo: updateUser.phoneNo,
        address: updateUser.address,
        city: updateUser.city,
        zipCode: updateUser.zipCode,
      };

      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));

      if (file) {
        formData.append("image", file);
      }

      const res = await axios.put(
        `/user/update-user/${user.id || id}`,formData);


      toast.success(res.data.message);

      dispatch(setUser(res.data.user));

      setUpdateUser((prev) => ({
        ...prev,
        profilePic: res.data.user.profileImageUrl,
      }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Profile update failed");
    }
  };




  return (
    <div className="pt-20 bg-gray-200 min-h-screen">
      <div className="max-w-xl mx-auto">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* ---------------- PROFILE TAB ---------------- */}
          <TabsContent value="profile">
            <div className="p-2">
              <div className="bg-white shadow-lg rounded-3xl p-4">
                <h1 className="font-bold mb-4 text-2xl text-gray-800 text-center">
                  Update Profile
                </h1>

                <div className="w-full flex flex-col md:flex-row gap-10 justify-center items-center md:items-start px-2 max-w-2xl mx-auto">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center">
                    <img
                      src={updateUser?.profilePic || UserLogo}
                      alt="profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"
                    />
                    <Label className="mt-2 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                      Change Picture
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </Label>
                  </div>

                  {/* Form Inputs */}
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-2 w-full md:w-1/2"
                  >
                    <div>
                      <Label className="block text-sm font-medium mb-1">
                        Username
                      </Label>
                      <Input
                        type="text"
                        name="username"
                        value={updateUser.username}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium mb-1">
                        Email Address
                      </Label>
                      <Input
                        type="text"
                        name="email"
                        value={updateUser.email}
                        disabled
                        className="w-full border border-gray-300 p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium mb-1">
                        Phone Number
                      </Label>
                      <Input
                        type="text"
                        name="phoneNo"
                        value={updateUser.phoneNo}
                        onChange={handleChange}
                        placeholder="Enter Your Phone No"
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium mb-1">
                        Address
                      </Label>
                      <Input
                        type="text"
                        name="address"
                        value={updateUser.address}
                        onChange={handleChange}
                        placeholder="Enter Your Address"
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium mb-1">
                        City
                      </Label>
                      <Input
                        type="text"
                        name="city"
                        value={updateUser.city}
                        onChange={handleChange}
                        placeholder="Enter Your City"
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium mb-1">
                        ZipCode
                      </Label>
                      <Input
                        type="text"
                        name="zipCode"
                        value={updateUser.zipCode}
                        onChange={handleChange}
                        placeholder="Enter Your Pincode"
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <Button type="submit" className="w-full mt-2">
                      Update Profile
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ---------------- ORDERS / PASSWORD TAB ---------------- */}
          <TabsContent value="orders">
            <MyOrder />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
