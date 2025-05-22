"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInClient } from "../../src/lib/auth/signInClient";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const result = await signInClient(email, password);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      const path =
        result.role === "landlord"
          ? "/dashboard/landlord"
          : "/dashboard/tenant";
      router.push(path);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
