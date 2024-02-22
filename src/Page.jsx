import { Pomodoro } from "./Pomodoro";

export function Page() {
  return (
    <>
      <div className="h-screen p-4 flex justify-center items-center text-color4 bg-color1 flex-col gap-4 flex-wrap">
        <Pomodoro />
      </div>
    </>
  );
}
