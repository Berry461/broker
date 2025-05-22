"use client"
import { signInWithGoogle } from "../../src/actions/auth/signInWithGoogle"
import React, { useTransition } from "react";
import { FaGoogle } from "react-icons/fa";

const LoginGoogle = () => {
  const [isPending, startTransition] = useTransition();

  const handleGoogleLogin = () => {
    startTransition(async () => {
      await signInWithGoogle();
    });
  };
  return (
    <div
      onClick={handleGoogleLogin}
      className="w-full gap-4 hover:cursor-pointer mt-6 h-12 bg-gray-800 rounded-md p-4 flex justify-center items-center"
    >
      <FaGoogle className="text-white" />
      <p className="text-white">
        {isPending ? "Redirecting..." : "Login with Github"}
      </p>
    </div>
  );
};

export default LoginGoogle;
