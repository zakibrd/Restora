export default function Navbar({ tableNumber }) {
  return (
    <>
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-gradient-to-b from-amber-600 to-orange-500">
        <div
          className="flex items-center mx-auto h-20 max-w-2xl justify-between px-4 sm:h-22
        "
        >
          <h1 className="text-base font-semibold tracking-tight text-amber-100 sm:text-lg">
            PIZZA HOUSE
          </h1>
          <h2 className="text-base font-semibold tracking-tight text-amber-100 sm:text-lg">
            Table:{tableNumber}
          </h2>
        </div>
      </div>
    </>
  );
}
