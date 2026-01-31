import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Added useDispatch
import { toast } from "sonner";
import { setAllUsers } from "@/redux/userSlice"; 

import axios from "../../axiosWithJwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import UserLogo from "../../assets/UserLogo.jpg";

const UserInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const allUsers = useSelector((store) => store.user.allUsers || []);
  const selectedUser = allUsers.find((u) => String(u.id) === String(id));

  const [updateUser, setUpdateUser] = useState({
    username: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    role: "USER",
    profileImageUrl: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      setUpdateUser({
        username: selectedUser.username || "",
        email: selectedUser.email || "",
        phoneNo: selectedUser.phoneNo || "",
        address: selectedUser.address || "",
        city: selectedUser.city || "",
        zipCode: selectedUser.zipCode || "",
        role: selectedUser.role || "USER",
        profileImageUrl: selectedUser.profileImageUrl || "",
      });
    }
  }, [selectedUser]);

  if (!selectedUser) {
    return <div className="pt-20 text-center">User not found!</div>;
  }

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profileImageUrl: URL.createObjectURL(selectedFile),
    });
  };

  //submit handle


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        username: updateUser.username,
        phoneNo: updateUser.phoneNo,
        address: updateUser.address,
        city: updateUser.city,
        zipCode: updateUser.zipCode,
        role: updateUser.role,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      if (file) {
        formData.append("image", file);
      }

      const res = await axios.put(
        `/user/admin/update-user/${id}`,
        formData,
        {
          transformRequest: (data) => data,
        }
      );


      if (res.data.success) {
        toast.success(res.data.message);

        const updatedUsersList = allUsers.map((u) =>
          String(u.id) === String(id) ? res.data.user : u
        );

        dispatch(setAllUsers(updatedUsersList));
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "User update failed");
    }
  };








  return (
    <div className="pt-5 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="flex justify-center gap-10 w-full px-4">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <h1 className="font-bold mb-7 text-2xl text-gray-800">
              Update User (Admin)
            </h1>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-10 justify-center items-center md:items-start px-2 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <img
                src={updateUser.profileImageUrl || UserLogo}
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

            <form onSubmit={handleSubmit} className="space-y-2 w-full md:w-1/2">
              <InputField label="Username" name="username" value={updateUser.username} onChange={handleChange} />
              <InputField label="Email" name="email" value={updateUser.email} disabled />
              <InputField label="Phone Number" name="phoneNo" value={updateUser.phoneNo} onChange={handleChange} />
              <InputField label="Address" name="address" value={updateUser.address} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="City" name="city" value={updateUser.city} onChange={handleChange} />
                <InputField label="ZipCode" name="zipCode" value={updateUser.zipCode} onChange={handleChange} />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">Role</Label>
                <select
                  name="role"
                  value={updateUser.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <Button type="submit" className="w-full mt-2">
                Update User
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, disabled }) => (
  <div>
    <Label className="block text-sm font-medium mb-1">{label}</Label>
    <Input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border border-gray-300 p-2 rounded-lg ${disabled ? "bg-gray-100 cursor-not-allowed" : "focus:outline-none focus:ring-2 focus:ring-pink-500"
        }`}
    />
  </div>
);

export default UserInfo;