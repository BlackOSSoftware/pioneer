"use client";

import { useEffect, useState } from "react";
import { showAppModal, confirmAppModal } from "@/lib/pioneer-modal-bus";

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
      showAppModal("Failed to fetch contacts.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    const ok = await confirmAppModal("Delete this contact submission?", {
      title: "Delete contact",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;

    await fetch(`/api/contact-list?id=${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Contact Form Submissions
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-200 text-left">
                  Name
                </th>
                <th className="p-2 border border-gray-200 text-left">
                  Phone
                </th>
                <th className="p-2 border border-gray-200 text-left">
                  Email
                </th>
                <th className="p-2 border border-gray-200 text-left">
                  Subject
                </th>
                <th className="p-2 border border-gray-200 text-left">
                  Message
                </th>
                <th className="p-2 border border-gray-200 text-left">
                  Date
                </th>
                <th className="p-2 border border-gray-200 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((c) => (
                <tr
                  key={c._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="p-2 border border-gray-200 text-gray-900">
                    {c.name}
                  </td>

                  <td className="p-2 border border-gray-200">
                    <a
                      href={`tel:${c.phone}`}
                      className="text-blue-600 underline"
                    >
                      {c.phone}
                    </a>
                  </td>

                  <td className="p-2 border border-gray-200 text-gray-700">
                    {c.email}
                  </td>

                  <td className="p-2 border border-gray-200 text-gray-700">
                    {c.subject}
                  </td>

                  <td className="p-2 border border-gray-200 text-gray-700 max-w-xs truncate">
                    {c.message}
                  </td>

                  <td className="p-2 border border-gray-200 text-gray-700">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-2 border border-gray-200">
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
            <p className="text-center text-gray-500 py-6">
              No contact submissions found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
