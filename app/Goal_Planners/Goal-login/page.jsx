"use client";
import React, { useState } from "react";

export default function LoginModal({ open, onClose }) {
  const [pan, setPan] = useState("");
  const [password, setPassword] = useState("");
  if (!open) return null;

  const handleLogin = () => {
    // TODO: call your auth API here
    if (!pan || !password) {
      alert("Please enter PAN and password");
      return;
    }
    // fake success
    alert("Logged in (demo). Now you can map investments.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal box */}
      <div className="relative bg-white w-[560px] rounded shadow-lg z-10 overflow-hidden">
        <div className="bg-[#0d6b81] text-white px-6 py-4 font-semibold">Login</div>

        <div className="p-6">
          <div className="mb-4 flex items-center">
            <label className="w-32">PAN Number:</label>
            <input
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              className="border p-2 flex-1"
              placeholder="PAN"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="w-32">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 flex-1"
              placeholder="Password"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded">Close</button>
            <button onClick={handleLogin} className="px-4 py-2 bg-[#0b5a6d] text-white rounded">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
