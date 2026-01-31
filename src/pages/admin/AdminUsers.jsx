import React, { useEffect, useState } from "react";
import axios from "../../axiosWithJwt";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Edit, Eye } from "lucide-react";
import UserLogo from "../../assets/UserLogo.jpg";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setAllUsers } from "@/redux/userSlice";

const AdminUsers = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const allUsers = useSelector((store) => store.user.allUsers || []);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getAllUser = async () => {
    try {
      const res = await axios.get("/user/all");
      if (res.data.success) {
       // toast.success(res.data.message || "Users fetched successfully");
        dispatch(setAllUsers(res.data.user)); // Save in Redux
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const filteredUsers = allUsers.filter(
    (user) =>
      user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p1-[350px] py-20 pr-20 mx-auto px-4">
      <h1 className="font-bold text-2xl">User Management</h1>
      <p>View and manage registered users</p>
      <div className="flex relative w-[300px] mt-6">
        <Search className="absolute left-2 top-1 text-gray-600 w-5" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          placeholder="Search Users..."
        />
      </div>
      <div className="grid grid-cols-3 gap-7 mt-7">
        {filteredUsers.map((user, index) => (
          <div key={index} className="bg-pink-100 rounded-lg border-2">
            <div className="flex items-center gap-2">
              <img
                src={user?.profileImageUrl || UserLogo}
                alt=""
                className="rounded-full w-16 aspect-square object-cover border border-pink-600"
              />
              <div>
                <h1 className="font-semibold">{user?.username}</h1>
                <h3>{user?.email}</h3>
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              <Button
                onClick={() => navigate(`/dashboard/users/${user?.id}`)}
              >
                <Edit /> Edit
              </Button>
              <Button onClick={() => navigate(`/dashboard/users/orders/${user?.id}`)}>
                <Eye /> Show Order
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
