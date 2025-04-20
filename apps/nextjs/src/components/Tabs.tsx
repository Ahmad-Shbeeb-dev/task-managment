import Link from "next/link";

export function Tabs() {
  const tabsData = [
    {
      name: "Children",
      color: "",
      img: "/children.svg",
      link: "/dashboard/children",
    },
    {
      name: "Announcements",
      color: "#FFFCEE",
      img: "/announcements.svg",
      link: "/dashboard/announcements",
    },
    { name: "Reports", color: "#F4FFF6", img: "/reports.svg" },
  ];
  return (
    <div className="grid min-w-fit grid-cols-12 gap-4">
      {tabsData.map((tab) => (
        <Link
          href={tab.link ?? "/dashboard/home"}
          key={tab.name}
          className="col-span-12 flex items-center justify-between rounded-xl p-4 shadow-md lg:col-span-4"
          style={{ backgroundColor: tab.color }}
        >
          <p className="text-base font-semibold">{tab.name}</p>
          <img src={tab.img} alt="..." />
        </Link>
      ))}
    </div>
  );
}
