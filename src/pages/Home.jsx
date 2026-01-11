export default function Home() {
  return (
    <section
      className="relative h-[70vh] flex items-center justify-center text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Fresh. Authentic. Delicious.
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-6">
          Explore our mouth-watering menu and order your favorite dishes.
        </p>

        <a
          href="/menu"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-lg transition"
        >
          View Menu
        </a>
      </div>
    </section>
  );
}
