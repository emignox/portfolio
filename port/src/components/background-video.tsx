const BackgroundVideo = () => {
  return (
    <video
      id="video"
      className="fixed top-0 left-0 w-full h-screen z-[-10] m-0 p-0 border-none object-cover"
      autoPlay
      loop
      muted
      playsInline
      style={{
        filter: "blur(50px) brightness(70%)",
      }}
    >
      <source
        src="https://stockema.s3.eu-north-1.amazonaws.com/production_id_4779866+(1080p).mp4"
        type="video/mp4"
      />
      Il tuo browser non supporta il tag video.
    </video>
  );
};

export default BackgroundVideo;
