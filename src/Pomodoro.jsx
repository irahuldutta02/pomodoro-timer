import { useEffect, useRef, useState } from "react";

export function Pomodoro() {
  const audioRef = useRef(new Audio());

  const [showModal, setShowModal] = useState(false);
  const [music, setMusic] = useState("default");
  const [timerState, setTimerState] = useState("stopped");
  const [timerType, setTimerType] = useState("pomodoro");
  const [timer, setTimer] = useState({
    min: 50,
    sec: 0,
  });

  const timerRef = useRef(null);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (
        e.target.id !== "settingsModal" &&
        e.target.id !== "settingsButton" &&
        e.target.id !== "settingsIcon" &&
        e.target.id !== "musicChoice"
      ) {
        setShowModal(false);
      }
    });
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

  return (
    <>
      <div className="flex justify-center items-center">
        <h1 className="text-3xl">Pomodoro</h1>
      </div>
      <div className="flex justify-center items-center flex-col gap-8 w-full max-w-96 p-4 bg-color3 bg-opacity-15 shadow-lg rounded-lg">
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
        <div className="flex-1 w-full flex justify-center items-center text-6xl gap-4">
          <div className="">
            <span>{timer.min}</span> <span>:</span> <span>{timer.sec}</span>
          </div>
        </div>
        <div className="w-full flex justify-center items-center gap-4 font-bold">
          {timerState === "stopped" && (
            <button
              className="flex justify-center items-center bg-color2 px-6 py-2 rounded-lg"
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

      <div
        id="settingsButton"
        className="fixed bg-color4 text-color1 text-3xl p-2 rounded-lg flex justify-center items-center right-4 bottom-4 cursor-pointer"
        onClick={() => setShowModal(!showModal)}
      >
        <i id="settingsIcon" className="fa-solid fa-gear"></i>
      </div>
      <div
        id="settingsModal"
        className={`fixed w-56 h-40 bg-color4 right-[5rem] rounded-lg bottom-4 text-color1 flex justify-center p-4 items-center
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
          <option value="music_1">Music 1</option>
          <option value="music_2">Music 2</option>
        </select>
      </div>
    </>
  );
}
