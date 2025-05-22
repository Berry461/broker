"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpClient } from "../../src/lib/auth/signUpClient";

export default function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState<"landlord" | "tenant">("tenant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const result = await signUpClient(email, password, username, role);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            name="role"
            value="tenant"
            checked={role === "tenant"}
            onChange={() => setRole("tenant")}
          />
          Tenant
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="landlord"
            checked={role === "landlord"}
            onChange={() => setRole("landlord")}
          />
          Landlord
        </label>
      </div>

      <input
        type="text"
        placeholder="Username"
        className="p-2 border rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
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
        minLength={6}
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
