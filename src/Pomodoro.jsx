import { useEffect, useRef, useState } from "react";

export function Pomodoro() {
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
    
  }

  function handleStart() {
    setTimerState("running");
  }

  function handlePause() {
    setTimerState("paused");
  }

  function handleRest() {
    setTimerState("stopped");
  }

  function handleTimerType(type) {
    handleRest();
    setTimerType(type);
  }

  return (
    <>
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
            <span>{timer.min}</span> <span>:</span>{" "}
            <span>{timer.sec === 0 ? "00" : timer.sec}</span>
          </div>
        </div>
        <div className="w-full flex justify-center items-center gap-4 font-bold">
          <button
            className="flex justify-center items-center bg-color2 px-6 py-2 rounded-lg"
            onClick={handleStart}
          >
            Start
          </button>
          <button
            className="flex justify-center items-center bg-color2 px-6 py-2 rounded-lg"
            onClick={handlePause}
          >
            Pause
          </button>
          <button
            className="flex justify-center items-center bg-color3 text-color1 px-6 py-2 rounded-lg"
            onClick={handleRest}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        id="settingsButton"
        className="fixed bg-color4 text-color1 text-3xl p-2 rounded-lg flex justify-center items-center right-4 bottom-4 cursor-pointer"
        onClick={() => setShowModal(!showModal)}
      >
        <i id="settingsIcon" className="fa-solid fa-gear fa-spin"></i>
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
          onChange={(e) => setMusic(e.target.value)}
        >
          <option value="default">Select Music</option>
          <option value="music_1">Music_1</option>
          <option value="music_2">Music_2</option>
        </select>
      </div>
    </>
  );
}
