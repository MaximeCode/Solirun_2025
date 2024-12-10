// src/App.js
import React from 'react';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold">Solirun</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#about" className="hover:underline">À propos</a></li>
              <li><a href="#register" className="hover:underline">Inscription</a></li>
              <li><a href="#partners" className="hover:underline">Partenaires</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-cover bg-center h-[400px] flex items-center justify-center" style={{ backgroundImage: "url('https://via.placeholder.com/1500x400')" }}>
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold">Rejoignez-nous pour Solirun 2025 !</h2>
          <p className="mt-4 text-lg">Un événement solidaire et sportif pour une bonne cause.</p>
          <a href="#register" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Inscrivez-vous maintenant
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold mb-6">À propos de Solirun</h3>
          <p className="text-lg">
            Solirun est un événement qui allie sport et solidarité. Rejoignez-nous pour une course mémorable tout en soutenant des initiatives locales et internationales.
          </p>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="bg-blue-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold mb-6">Inscrivez-vous maintenant</h3>
          <p className="text-lg mb-6">Ne manquez pas l'opportunité de faire partie de cet événement unique !</p>
          <a href="/register" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            S'inscrire
          </a>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold mb-6">Nos Partenaires</h3>
          <div className="flex flex-wrap justify-center space-x-6">
            <img src="https://via.placeholder.com/150" alt="Partenaire 1" className="h-20" />
            <img src="https://via.placeholder.com/150" alt="Partenaire 2" className="h-20" />
            <img src="https://via.placeholder.com/150" alt="Partenaire 3" className="h-20" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Solirun. Tous droits réservés.</p>
          <ul className="flex justify-center space-x-6 mt-4">
            <li><a href="#about" className="hover:underline">À propos</a></li>
            <li><a href="#register" className="hover:underline">Inscription</a></li>
            <li><a href="#partners" className="hover:underline">Partenaires</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
