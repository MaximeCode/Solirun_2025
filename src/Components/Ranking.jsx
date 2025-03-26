import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import ClassePodiumItem from "./RankingPodiumItem";
import ClasseItem from "./RankingItem";
import Clock from "./Clock";

const Classement = ({ data }) => {
  // Trier les classes par nombre de tours (décroissant)
  const sortedData = [...data].sort((a, b) => b.laps - a.laps);

  // Refs for elements we need to measure
  const scrollContainerRef = useRef(null);
  const podiumRef = useRef(null);
  const mainContainerRef = useRef(null);

  // Ref to store interval IDs for cleanup
  const scrollIntervalRef = useRef(null);

  // State to store calculated height
  const [containerHeight, setContainerHeight] = useState("auto");

  // Calculate and set the available height
  useEffect(() => {
    const calculateAvailableHeight = () => {
      if (!mainContainerRef.current || !podiumRef.current) return;

      const viewportHeight = window.innerHeight;
      const mainContainerRect =
        mainContainerRef.current.getBoundingClientRect();
      const podiumRect = podiumRef.current.getBoundingClientRect();

      // Calculate remaining space (viewport height - (podium bottom position + some padding))
      const topOffset = podiumRect.bottom - mainContainerRect.top;
      const padding = 40; // Adjust padding as needed
      const availableHeight = viewportHeight - topOffset - padding;

      // Set minimum height to avoid too small container
      setContainerHeight(`${Math.max(150, availableHeight)}px`);
    };

    // Initial calculation
    calculateAvailableHeight();

    // Recalculate on window resize
    window.addEventListener("resize", calculateAvailableHeight);

    return () => {
      window.removeEventListener("resize", calculateAvailableHeight);
    };
  }, [sortedData]);

  // Setup infinite scrolling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || sortedData.length <= 3) return;

    let scrollPosition = 0;
    let direction = "down";

    // Clear any existing intervals when re-setting up
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    const startScrolling = () => {
      scrollIntervalRef.current = setInterval(() => {
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;

        // Only scroll if content is larger than container
        if (scrollHeight <= clientHeight) {
          clearInterval(scrollIntervalRef.current);
          return;
        }

        if (direction === "down") {
          scrollPosition += 1; // Speed of scrolling down

          // When we reach the bottom, switch direction after a pause
          if (scrollPosition >= scrollHeight - clientHeight) {
            clearInterval(scrollIntervalRef.current);

            setTimeout(() => {
              direction = "up";
              startScrolling();
            }, 3000); // Pause at bottom for 2 seconds
          }
        } else {
          scrollPosition -= 1; // Speed of scrolling up

          // When we reach the top, switch direction after a pause
          if (scrollPosition <= 0) {
            clearInterval(scrollIntervalRef.current);
            scrollPosition = 0;

            setTimeout(() => {
              direction = "down";
              startScrolling();
            }, 3000); // Pause at top for 2 seconds
          }
        }

        scrollContainer.scrollTop = scrollPosition;
      }, 40); // Adjust scroll speed (lower = faster)
    };

    // Start the infinite scrolling
    startScrolling();

    // Clean up on unmount
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [sortedData, containerHeight]);

  return (
    <div
      ref={mainContainerRef}
      className="text-white p-8 min-h-screen">
      <Clock />
      <h2 className="text-6xl font-extrabold text-center my-8">
        Classement général
      </h2>
      {sortedData.length > 0 ? (
        <>
          <div
            ref={podiumRef}
            className="bg-orange-100 px-4 pb-4 rounded-lg">
            <h3 className="text-black text-4xl px-4 py-2 font-extrabold">
              Podium
            </h3>
            <div className="space-y-2">
              {sortedData.slice(0, 3).map((classe, index) => (
                <div key={classe.id}>
                  <ClassePodiumItem
                    rank={index + 1}
                    classe={classe}
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            style={{
              height: containerHeight,
              scrollbarWidth: "none", // Firefox
            }}
            className="mt-6 bg-transparent rounded-lg py-4 overflow-y-auto scroll-smooth">
            {/* Hide scrollbar for Chrome, Safari and Opera */}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="space-y-2">
              {sortedData.slice(3).map((classe, index) => (
                <div key={classe.id}>
                  <ClasseItem
                    rank={index + 4}
                    classe={classe}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-orange-100 px-4 pb-4 rounded-lg">
          <p className="text-black text-center text-4xl px-4 py-2 font-extrabold">
            Aucune course n'a été couru !
          </p>
        </div>
      )}
    </div>
  );
};

Classement.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      laps: PropTypes.number.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Classement;
