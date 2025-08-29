
"use client"

import SignupModal from "@/components/SignupModal"
import { useNavigate } from "react-router-dom"

export default function SignupPage() {
  const router = useNavigate()
  
  return <SignupModal onClose={() => {router("/") }} />
}
