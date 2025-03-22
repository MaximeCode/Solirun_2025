"use client";

import "./globals.css";
import { socket } from "../utils/socket";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Script from "next/script";

export default function RootLayout({ children }) {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <html
      lang="en"
      data-theme="fantasy">
      <body className="h-full">
        <main>{children}</main>
        {/* Confettis pour la page Podium */}
        <Script
          data-trigger="custom"
          src="https://run.confettipage.com/here.js"
          data-confetticode="U2FsdGVkX1+ZiPDGcXsNuSCOWFwRY5wW5vx7N+h5xl7t8ALXVSs/hOMypj+U7iDJKMIFkmBN8X+lf1fWzWKANISBtCz23Kf/y+iCii4KQIh7UCwLnmb2RQqhwzPoNnYAbstRww90AqKqldFqPE8/80WTxNaZCIebs4Xa9opFeS3deZMYJQFKt7dN5vWl1HC9Hx2T+CLxrly+78DJFxHQ31lckBt/oIr8kaL42WxQqQlV5DNyPVHxFd0JEtKGF2UcmpgaH5+A5hrp5fNuT7th3wM95ASGkYmlN8eBFyI6ivfigb93C0DykMba81M8P8b+nfpo6cj4T8sgdPDoqDFM71iwR2apxhgpKGobrHok6PP77MWuCCkWYcUvKVWjjmEWP9NkYm31mdih/vzHxX9H6Qkt/feaZCl0BQvmF5xVe18j0jupEgN99/7aW48iaxUadJCNIjlMn57TJyFF0PXyp/MD7FEJuGLVK9brZ9Kj1ZNU7/fabJr0qU5G4GFrD0eABMqgSrnnByJnU+IgeKzidGVd8XHVTSJldOXZskI6BVsXI9DYvSJBUkCZAho6NefRJyvAKmgmalDhmhHJJ4LB5+btqGziYLBrPqlPEZCF4rZ13A7X2tETKsdz2ZcC1efaMGvrmTQZmqF6US8Jqkf84wb4kDoKMYsSGrBxUpbLWHo/TjSR5RFI4uKGMj6Cm6NDC5NRtcAtMffpr+KCzoE5hmqRi9IQzS+peRo0xsTPZ1NNOqZ3OIilaUvQGY0MgtLf"
          strategy="afterInteractive"></Script>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
