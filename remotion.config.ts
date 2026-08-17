import {Config} from "@remotion/cli/config";

// Deterministic, high-quality still frames for each rendered video frame.
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
