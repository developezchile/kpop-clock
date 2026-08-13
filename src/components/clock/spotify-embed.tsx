export function SpotifyEmbed() {
  return (
    <iframe
      data-testid="embed-iframe"
      style={{ borderRadius: 12 }}
      src="https://open.spotify.com/embed/playlist/2cZGJe3k17PmoqPvgtS6vA?utm_source=generator&si=0182345a3b3a4382"
      width="100%"
      height="380"
      frameBorder={0}
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
