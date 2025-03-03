import Header from "@/Components/Header";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="container mx-auto">
        <Header />
        {children}
      </body>
    </html>
  );
}
