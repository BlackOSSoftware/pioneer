"use client";

import { useEffect, useState } from "react";

export default function ContactListPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/contact-list");
      const data = await res.json();

      if (data.success) {
        setContacts(data.messages);
      }
    } catch (err) {
      alert("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    if (!confirm("Delete this contact?")) return;

    await fetch(`/api/contact-list?id=${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Contact Form Submissions
      </h2>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 dark:border-slate-700">
            <thead className="bg-gray-100 dark:bg-slate-800">
              <tr>
                <th className="p-2 border border-gray-200 dark:border-slate-700 text-left">
                  Name
                </th>
                <th className="p-2 border border-gray-200 dark:border-slate-700 text-left">
                  Phone
                </th>
                <th className="p-2 border border-gray-200 dark:border-slate-700 text-left">
                  Email
                </th>
                <th className="p-2 border border-gray-200 dark:border-slate-700 text-left">
                  Subject
                </th>
                <th className="p-2 border border-gray-200 dark:border-slate-700 text-left">
                  Message
                </th>
                <th className="p-2 border border-gray-200 dark:border-slate-700 text-left">
                  Date
                </th>
                <th className="p-2 border border-gray-200 dark:border-slate-700 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((c) => (
                <tr
                  key={c._id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  <td className="p-2 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-gray-100">
                    {c.name}
                  </td>

                  <td className="p-2 border border-gray-200 dark:border-slate-700">
                    <a
                      href={`tel:${c.phone}`}
                      className="text-blue-600 dark:text-blue-400 underline"
                    >
                      {c.phone}
                    </a>
                  </td>

                  <td className="p-2 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300">
                    {c.email}
                  </td>

                  <td className="p-2 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300">
                    {c.subject}
                  </td>

                  <td className="p-2 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 max-w-xs truncate">
                    {c.message}
                  </td>

                  <td className="p-2 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-2 border border-gray-200 dark:border-slate-700">
                    <button
                      onClick={() => deleteContact(c._id)}
                      className="
                        bg-red-500 hover:bg-red-600
                        text-white
                        px-3 py-1 rounded
                        text-xs transition
                      "
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {contacts.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">
              No contact submissions found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
