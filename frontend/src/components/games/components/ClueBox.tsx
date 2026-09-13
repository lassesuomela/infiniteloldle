import axios from "axios";
import { useEffect, useState } from "react";
import Config from "../../../configs/config";

type GameType = "champion" | "skin" | "ability" | "splash";

type ClueEndpoint = {
  endpoint: string;
  type: string;
  label: string;
  thresholdKey: string;
};

type ClueThresholds = Record<string, Record<string, number>>;

type ClueData = {
  data: string;
};

type ClueBoxProps = {
  guessCount: number;
  gameType: GameType;
  clueEndpoints: ClueEndpoint[];
};

export default function ClueBox({
  guessCount,
  gameType,
  clueEndpoints,
}: ClueBoxProps) {
  const [clueThresholds, setClueThresholds] = useState<ClueThresholds | null>(
    null,
  );
  const [configLoaded, setConfigLoaded] = useState(false);
  const [clueData, setClueData] = useState<Record<string, ClueData>>({});
  const [activeClue, setActiveClue] = useState<string | null>(null);

  useEffect(() => {
    FetchClueConfig();
  }, []);

  const FetchClueConfig = () => {
    axios
      .get(Config.url + "/config")
      .then((response) => {
        if (response.data.status === "success") {
          setClueThresholds(response.data.config.clue);
          setConfigLoaded(true);
        }
      })
      .catch((error) => {
        console.log("Error fetching clue config:", error);
        // Fallback to defaults if config fetch fails
        setClueThresholds({
          champion: { abilityClueThreshold: 5, splashClueThreshold: 12 },
          ability: { splashClueThreshold: 8 },
          splash: { abilityClueThreshold: 8 },
        });
        setConfigLoaded(true);
      });
  };

  const FetchClue = (endpoint: string, clueType: string) => {
    if (clueData[clueType]) {
      // Already fetched, just toggle
      setActiveClue(activeClue === clueType ? null : clueType);
      return;
    }

    axios
      .get(Config.url + endpoint, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.status === "success" && response.data.clue) {
          setClueData((prev) => ({
            ...prev,
            [clueType]: response.data.clue,
          }));
          setActiveClue(clueType);
        }
      })
      .catch((error) => {
        console.log(`Error fetching ${clueType} clue:`, error);
      });
  };

  const toggleClue = (endpoint: string, clueType: string) => {
    if (activeClue === clueType) {
      // Hide current clue
      setActiveClue(null);
    } else {
      // Show this clue (and hide others)
      if (!clueData[clueType]) {
        FetchClue(endpoint, clueType);
      } else {
        setActiveClue(clueType);
      }
    }
  };

  const getThreshold = (thresholdKey: string): number => {
    return clueThresholds?.[gameType]?.[thresholdKey] ?? 999;
  };

  if (!configLoaded || !clueThresholds) return null;

  if (guessCount < 2) return null;

  return (
    <div className="d-flex justify-content-center mb-4">
      <div className="card" id="clue-box">
        <div className="card-body text-center">
          <h5 className="card-title">💡 Clues</h5>

          <div className="d-flex justify-content-center flex-wrap gap-2 mb-3 mt-4">
            {clueEndpoints.map((clueConfig) => {
              const threshold = getThreshold(clueConfig.thresholdKey);
              const isUnlocked = guessCount >= threshold;
              const isActive = activeClue === clueConfig.type;

              return (
                <button
                  key={clueConfig.type}
                  className={`btn ${isUnlocked ? "btn-dark" : "btn-secondary"}`}
                  onClick={() =>
                    toggleClue(clueConfig.endpoint, clueConfig.type)
                  }
                  disabled={!isUnlocked}
                  style={{ minWidth: "150px" }}
                >
                  {isUnlocked
                    ? isActive
                      ? `Hide ${clueConfig.label}`
                      : `Show ${clueConfig.label}`
                    : `${clueConfig.label} (${threshold - guessCount} more)`}
                </button>
              );
            })}
          </div>

          {activeClue && clueData[activeClue] && (
            <div className="mt-3 mb-3">
              <p className="text-muted mb-2">
                {clueEndpoints.find((c) => c.type === activeClue)?.label}:
              </p>
              <img
                src={`data:image/webp;base64,${clueData[activeClue].data}`}
                alt={`${activeClue} clue`}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  border: "2px solid #dee2e6",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
