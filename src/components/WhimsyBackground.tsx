export function WhimsyBackground() {
  return (
    <div className="whimsy-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="whimsy-bg-image absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/bg/heartopia-pink-trees.png')" }}
      />
      <div className="whimsy-bg-sky absolute inset-0" />
      <div className="whimsy-bg-cloud whimsy-bg-cloud-1" />
      <div className="whimsy-bg-cloud whimsy-bg-cloud-2" />
      <div className="whimsy-bg-cloud whimsy-bg-cloud-3" />
    </div>
  );
}
