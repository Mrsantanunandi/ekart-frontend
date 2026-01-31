import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from "../axiosWithJwt";

export default function VerifyEmail() {

  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState("Verifying...")
  const navigate = useNavigate()

  const hasVerified = useRef(false) 

  const verifyEmail = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/user/verify?token=${token}`
      )

      setStatus(res.data) // backend sends string

      setTimeout(() => {
        navigate("/login")
      }, 2000)

    } catch (error) {
      console.log(error)
      if (error.response?.status === 400) {
        setStatus("This verification link has already been used.")
      } else {
        setStatus("Verification failed. Please try again later.")
      }
    }
  }

  useEffect(() => {
    if (!token || hasVerified.current) return

    hasVerified.current = true
    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-center w-[90%] max-w-md">
        <h2 className="text-xl font-semibold text-gray-800">
          {status}
        </h2>
      </div>
    </div>
  )
}
