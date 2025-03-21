"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";

// Extracted component for a podium position
const PodiumPosition = ({
  position,
  data,
  isVisible,
  height,
  medal,
  bgColor,
  textColor,
}) => {
  return (
    <div
      className={`flex flex-col items-center transition-all duration-1000 ease-in-out w-120 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
      <div className="text-4xl p-4 font-extrabold animate-samba w-full text-center">
        {data?.name ?? "Chargement..."}
      </div>
      <div
        className={`text-6xl ${bgColor} ${textColor} font-bold w-100 flex items-center justify-center rounded-t-lg transition-all duration-1500 ease-in-out ${
          isVisible ? `h-${height}` : "h-0"
        }`}>
        {medal}
      </div>
      <div
        className={`text-4xl ${
          textColor === "text-black" ? bgColor.replace("400", "500") : bgColor
        } w-100 h-20 flex items-center justify-center font-bold rounded-b-lg`}>
        {data?.laps ?? "Chargement..."} tours
      </div>
    </div>
  );
};

PodiumPosition.propTypes = {
  position: PropTypes.number.isRequired,
  data: PropTypes.object,
  isVisible: PropTypes.bool,
  height: PropTypes.string.isRequired,
  medal: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
};

function Podium() {
  const [showSecond, setShowSecond] = useState(false);
  const [showFirst, setShowFirst] = useState(false);
  const [showThird, setShowThird] = useState(false);
  const [PodiumData, setPodiumData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching data...");
    fetch("http://localhost:3030/api.php?action=Ranking")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
      })
      .then((data) => {
        setPodiumData(data);
        setLoading(false);
      });

    setTimeout(() => setShowThird(true), 1000); // 3ème place après 1s
    setTimeout(() => setShowSecond(true), 2000); // 2ème place après 2s
    setTimeout(() => setShowFirst(true), 5000); // 1ère place après 5s

    // Delay the start of fireworks
    setTimeout(() => {
      if (PodiumData.length === 0) return;
      window.ConfettiPage.play();
    }, 6000);
  }, []);

  const renderContent = () => {
    if (PodiumData.length === 0) {
      if (loading) {
        return (
          <div className="bg-gradient-to-br from-gray-900 via-gray-750 to-gray-900 h-screen w-screen">
            <div className="h-screen flex items-center justify-center text-white">
              <h1 className="text-2xl font-bold text-center animate-fadeIn">
                Chargement des données...
              </h1>
            </div>
          </div>
        );
      }
      return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-750 to-gray-900 h-screen w-screen">
          <button
            className="absolute top-0 left-0 p-4 text-white"
            onClick={() => window.history.back()}>
            🡠 Retour
          </button>
          <div className="h-screen flex items-center justify-center text-red-500">
            <h1 className="text-2xl font-bold text-center animate-fadeIn">
              Aucune course n'a été couru pour le moment !
            </h1>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="absolute top-10 left-1/12">
          <div>Logo Solirun</div>
        </div>

        <div
          className="absolute top-10 right-1/12 bg-white rounded-lg opacity-0 animate-fadeIn"
          style={{
            animationDelay: "6s",
            animationFillMode: "forwards",
          }}>
          <Image
            src="/SIOFulbert.png"
            width={200}
            height={200}
            alt="Logo SIO Fulbert"
          />
        </div>

        <div className="fixed top-0 left-0 bg-gradient-to-br from-gray-900 via-gray-750 to-gray-900 h-screen w-screen -z-1">
          <div
            className={`h-full flex flex-col items-center justify-center text-white overflow-hidden ${
              showThird && showSecond && !showFirst ? "animate-podium" : ""
            }`}>
            <h1 className="text-5xl font-extrabold mb-8 text-center animate-fadeIn z-1">
              🏆 Podium de la Course 🏁
            </h1>

            <div className="flex items-end justify-center gap-6 w-full">
              <PodiumPosition
                position={2}
                data={PodiumData[1]}
                isVisible={showSecond}
                height="70"
                medal="🥈"
                bgColor="bg-gray-400"
                textColor="text-black"
              />

              <PodiumPosition
                position={1}
                data={PodiumData[0]}
                isVisible={showFirst}
                height="100"
                medal="🏆"
                bgColor="bg-yellow-400"
                textColor="text-black"
              />

              <PodiumPosition
                position={3}
                data={PodiumData[2]}
                isVisible={showThird}
                height="40"
                medal="🥉"
                bgColor="bg-orange-400"
                textColor="text-black"
              />
            </div>

            <p className="mt-8 text-4xl font-extrabold text-gray-300 animate-flash">
              🎊 Bravo aux gagnants ! 🎉
            </p>
          </div>
        </div>
      </>
    );
  };

  return <>{renderContent()}</>;
}

export default Podium;
