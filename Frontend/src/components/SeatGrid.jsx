import Seat from "./Seat";

export default function SeatGrid() {
  const seats = ["A1"]; // single-seat stress demo

  return (
    <div className="bg-linear-to-br from-[#0d1117]/50 to-[#161b22]/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
      <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-6">Available Seats</p>
      <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md">
        {seats.map((seat) => (
          <Seat key={seat} seatId={seat} />
        ))}
      </div>
    </div>
  );
}
