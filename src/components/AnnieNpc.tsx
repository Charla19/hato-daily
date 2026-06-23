export function AnnieNpc() {
  return (
    <div
      className="annie-npc pointer-events-none fixed bottom-0 right-[1vw] z-[3] hidden min-[1100px]:block"
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/npcs/annie.png"
        alt=""
        draggable={false}
        className="annie-npc-img block h-[min(58vh,540px)] w-auto max-w-none select-none object-contain object-bottom"
      />
    </div>
  );
}
