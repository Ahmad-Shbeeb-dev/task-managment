import { Separator } from "./ui/Separator";

export const ActivityClass = () => {
  return (
    <div className="mt-10">
      <h2 className="ml-4">Activity</h2>
      <Separator className="my-2" />
      <div className="ml-4 flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-md bg-yellow-500" />
          <h3>Breakfast</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-md bg-blue-600" />
          <h3>Sand box</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-md bg-sky-400" />
          <h3>Untitled</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-md bg-violet-600" />
          <h3>Untitled</h3>
        </div>
        <button className="text-gray-500">Add activity +</button>
      </div>
    </div>
  );
};
