import { Config } from "@remotion/cli/config";

// Output settings. Codec defaults to h264 for the .mp4 output path.
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// staticFile() serves from ./public — bin/voice.mjs and bin/broll.mjs write there.
// (public is Remotion's default public dir, so no extra config is needed.)

// Rendering on a headless Linux server with no GPU? Uncomment:
// Config.setChromiumOpenGlRenderer("swiftshader");
