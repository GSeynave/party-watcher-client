type Props = {
  url: string;
};
function YoutubeIframe({ url }: Props) {
  if (!url) {
    return <div>No video URL provided.</div>;
  }
  url = url.replace("watch?v=", "embed/");
  const tag = document.createElement("script");
  tag.id = "iframe-demo";
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player("existing-iframe-example", {
      events: {
        onReady: onPlayerReady,
        onStateChange: () => {
          console.log("Player state changed");
        },
      },
    });
  }
  function onPlayerReady(event) {
    document.getElementById("existing-iframe-example").style.borderColor =
      "#FF6D00";
  }
  return (
    <>
      {url !== "" ? (
        <iframe
          id="existing-iframe-example"
          width="800"
          height="600"
          src={url}
          className="border: solid 4px #37474F"
        ></iframe>
      ) : (
        <div>Your video can't be played.</div>
      )}
    </>
  );
}

export { YoutubeIframe };
