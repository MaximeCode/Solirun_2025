"use client";

import Header from "@/Components/Header";
import PropTypes from "prop-types";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
