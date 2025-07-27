'use client'

import Image from "next/image";
import { redirect, useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Home() {
  const router=useRouter()
  let user
  useEffect(()=>{
    user=localStorage.getItem('login')||false
    if(user){
      sessionStorage.setItem('login',user)
      redirect('/posts')
    }
    else{
    redirect('/login')
    }
  },[])
  return (
    <></>
  );
}
