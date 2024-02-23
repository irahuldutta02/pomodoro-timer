import { useEffect, useRef, useState } from "react";

export function Pomodoro() {
  const [showModal, setShowModal] = useState(false);
  const [music, setMusic] = useState("default");
  const [timerState, setTimerState] = useState("stopped");
  const [timerType, setTimerType] = useState("pomodoro");
  const [date, setDate] = useState(new Date());
  const [musicVolume, setMusicVolume] = useState(100); // [0, 100]
  const [timer, setTimer] = useState({
    min: 50,
    sec: 0,
  });

  const timerRef = useRef(null);
  const audioRef = useRef(new Audio());
  const dateTimeRef = useRef(null);
  const settingsRef = useRef(null);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowModal(false);
      }
    });
  }, []);

  useEffect(() => {
    function updateDateTime() {
      clearInterval(dateTimeRef.current);

      dateTimeRef.current = setInterval(() => {
        setDate(new Date());
      }, 1000);
    }

    updateDateTime();
  }, []);

  function startTimer() {
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev.min === 0 && prev.sec === 0) {
          clearInterval(timerRef.current);
          handleRest();
          return prev;
        }
        if (prev.sec === 0) {
          return {
            min: prev.min - 1,
            sec: 59,
          };
        }
        return {
          min: prev.min,
          sec: prev.sec - 1,
        };
      });
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerRef.current);
  }

  function handleStart() {
    setTimerState("running");
    startTimer();
  }

  function handlePause() {
    setTimerState("paused");
    stopTimer();
  }

  function handleResume() {
    setTimerState("running");
    startTimer();
  }

  function handleRest() {
    setTimerState("stopped");
    setTimeAccordingToTimerType(timerType);
    stopTimer();
  }

  function setTimeAccordingToTimerType(timerType) {
    if (timerType === "pomodoro") {
      setTimer({ min: 50, sec: 0 });
    } else if (timerType === "short-break") {
      setTimer({ min: 10, sec: 0 });
    } else if (timerType === "long-break") {
      setTimer({ min: 15, sec: 0 });
    }
  }

  function handleTimerType(type) {
    setTimerType(type);
    handleRest();
  }

  function handleMusicChange() {
    setShowModal(false);
  }

  useEffect(() => {
    setTimeAccordingToTimerType(timerType);
  }, [timerType]);

  useEffect(() => {
    if (music === "default") {
      audioRef.current.src = "";
    }
    if (music === "music_1") {
      audioRef.current.src = "music/music_1.mp3";
    }
    if (music === "music_2") {
      audioRef.current.src = "music/music_2.mp3";
      audioRef.current.currentTime = 51;
    }

    if (music !== "default" && timerState === "running") {
      audioRef.current.play();
      audioRef.current.loop = true;
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [music, timerState]);

  useEffect(() => {
    audioRef.current.volume = musicVolume / 100;
  }, [musicVolume]);

  function getDayName(day) {
    switch (day) {
      case 0:
        return "SUN";
      case 1:
        return "MON";
      case 2:
        return "TUE";
      case 3:
        return "WEB";
      case 4:
        return "THU";
      case 5:
        return "FRI";
      case 6:
        return "SAT";
    }
  }

  return (
    <>
      {/* Data Time */}
      <div id="datetime">
        <div className="fixed font-bold bg-color4 text-color1 py-1 px-2 rounded-lg flex justify-center items-center gap-4 left-4 top-4 text-sm tracking-widest min-w-[17rem]">
          <span>{date.toLocaleDateString()}</span>
          <span>{date.toLocaleTimeString()}</span>
          <span>{getDayName(date.getDay())}</span>
        </div>
      </div>

      {/* App Heading */}
      <div className="flex justify-center items-center">
        <h1 className="text-3xl">Pomodoro</h1>
      </div>

      {/* Main Block */}
      <div className="flex justify-center items-center flex-col gap-4 w-full max-w-96 p-4 bg-color3 bg-opacity-15 shadow-lg rounded-lg">
        {/* timer types */}
        <div className="flex justify-center items-center gap-4 font-bold text-sm w-full">
          <button
            disabled={timerState === "running"}
            className={`flex justify-center items-center  rounded-md bg-opacity-20 p-1 ${
              timerState === "running" && "cursor-not-allowed"
            } ${timerType === "pomodoro" && "bg-color4"}`}
            onClick={() => {
              handleTimerType("pomodoro");
            }}
          >
            Pomodoro
          </button>

          <button
            disabled={timerState === "running"}
            className={`flex justify-center items-center  rounded-md bg-opacity-20 p-1 ${
              timerState === "running" && "cursor-not-allowed"
            } ${timerType === "short-break" && "bg-color4"}`}
            onClick={() => {
              handleTimerType("short-break");
            }}
          >
            Short Break
          </button>

          <button
            disabled={timerState === "running"}
            className={`flex justify-center items-center  rounded-md bg-opacity-20 p-1 ${
              timerState === "running" && "cursor-not-allowed"
            } ${timerType === "long-break" && "bg-color4"}`}
            onClick={() => {
              handleTimerType("long-break");
            }}
          >
            Long Break
          </button>
        </div>

        {/* timer */}
        <div className="flex-1 w-full flex justify-center p-4 items-center text-5xl lg:text-6xl gap-4">
          <div className="">
            <span>{timer.min}</span> <span>:</span> <span>{timer.sec}</span>
          </div>
        </div>

        {/* control buttons */}
        <div className="w-full flex justify-center items-center gap-4 font-bold text-sm">
          {timerState === "stopped" && (
            <button
              className="flex justify-center items-center bg-color2 p-2 min-w-24 rounded-lg"
              onClick={handleStart}
            >
              Start
            </button>
          )}
          {timerState === "running" && (
            <button
              className="flex justify-center items-center bg-color2 px-6 py-2 rounded-lg"
              onClick={handlePause}
            >
              Pause
            </button>
          )}
          {timerState === "paused" && (
            <button
              className="flex justify-center items-center bg-color2 px-6 py-2 rounded-lg"
              onClick={handleResume}
            >
              Resume
            </button>
          )}
          {timerState === "running" && (
            <button
              className="flex justify-center items-center bg-color3 text-color1 px-6 py-2 rounded-lg"
              onClick={handleRest}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* music settings */}
      <div id="settings" ref={settingsRef}>
        <div
          id="settingsButton"
          className="fixed bg-color4 text-color1 py-1 px-2 rounded-lg flex justify-center items-center right-4 bottom-4 font-bold cursor-pointer"
          onClick={() => setShowModal(!showModal)}
        >
          <div className="flex justify-end items-center gap-2 text-sm rounded-md cursor-pointer ">
            {music == "default" ? (
              <>
                <span>
                  <i className="fa-solid fa-volume-xmark"></i>
                </span>
                <span>No Music</span>
              </>
            ) : music == "music_1" ? (
              <>
                <span>
                  <i
                    className={`fa-solid fa-music ${
                      timerState === "running" && "fa-spin-pulse"
                    }`}
                  ></i>
                </span>
                <span>
                  <span>Kishna Flute</span>
                </span>
              </>
            ) : (
              <>
                <span>
                  <i
                    className={`fa-solid fa-music ${
                      timerState === "running" && "fa-spin-pulse"
                    }`}
                  ></i>
                </span>
                <span>
                  <span>Focus Lofi</span>
                </span>
              </>
            )}
          </div>
        </div>
        <div
          className={`fixed w-40 h-40 bg-color4 rounded-lg right-[8rem] bottom-4 text-color1 flex justify-center p-4 items-center flex-col gap-4
      ${showModal ? "block" : "hidden"}
      `}
        >
          <select
            id="musicChoice"
            name="musicChoice"
            className="w-full p-2 rounded-md bg-color3 outline-none "
            value={music}
            onChange={(e) => {
              setMusic(e.target.value);
              handleMusicChange(e.target.value);
            }}
          >
            <option value="default">No Music</option>
            <option value="music_1">Krishna Flute</option>
            <option value="music_2">Focus Lofi</option>
          </select>
          <div className="w-full flex justify-center items-center flex-col gap-2">
            <label htmlFor="musicVolume">Volume</label>
            <input
              type="range"
              name="musicVolume"
              id="musicVolume"
              min="1"
              max="100"
              className="w-full text-color2 h-2 bg-color1 rounded-lg appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-color2 [&::-webkit-slider-thumb]:rounded-full
              "
              value={musicVolume}
              onChange={(e) => setMusicVolume(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
