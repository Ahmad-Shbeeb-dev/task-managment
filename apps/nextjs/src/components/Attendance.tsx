export function Attendance() {
  const dashArray = 85 * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * 70) / 100;
  return (
    <div>
      <h1 className="pt-1 text-lg font-semibold">Attendance Now</h1>
      <div className="mt-6 w-full rounded-lg border-2 p-4 pb-2 shadow">
        <svg
          width={200}
          height={200}
          viewBox={"0 0 200 200"}
          className="mx-auto"
        >
          <circle
            cx={100}
            cy={100}
            strokeWidth={"15px"}
            r={85}
            className="fill-none stroke-slate-300"
          />
          <circle
            cx={100}
            cy={100}
            strokeWidth={"15px"}
            r={85}
            className="fill-none stroke-green-400"
            style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }}
          />
        </svg>
        <div className="flex justify-between">
          <p>
            <span className="mr-2 inline-block h-4 w-4 rounded-sm bg-green-400"></span>
            Teachers
          </p>
          <p className="text-green-400">25/30</p>
        </div>
        <div className="flex justify-between">
          <p>
            <span className="bg-blue mr-2 inline-block h-4 w-4 rounded-sm"></span>
            Students
          </p>
          <p className="text-blue">324/350</p>
        </div>
      </div>
    </div>
  );
}
