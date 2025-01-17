export interface SongPreset {
  name: string;
  artist: string;
  is_explicit: number;
  duration_ms: number;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
}

export const songPresets: SongPreset[] = [
  {
    name: "Reckoner",
    artist: "Radiohead",
    is_explicit: 0,
    duration_ms: 0.29614034,
    danceability: 0.49595142,
    energy: 0.63325915,
    key: 0.36363636,
    loudness: 0.73668253,
    mode: 0,
    speechiness: 0.02931596,
    acousticness: 0.49798817,
    instrumentalness: 0.16119097,
    liveness: 0.07136189,
    valence: 0.23891129,
    tempo: 0.44197502
  },
  {
    name: "Shake It Off",
    artist: "Taylor Swift",
    is_explicit: 0,
    duration_ms: 0.21972262,
    danceability: 0.65384615,
    energy: 0.77955468,
    key: 0.63636364,
    loudness: 0.78807898,
    mode: 1,
    speechiness: 0.17155266,
    acousticness: 0.06023386,
    instrumentalness: 0,
    liveness: 0.5010891,
    valence: 0.95262097,
    tempo: 0.67858097
  },
  {
    name: "Lay All Your Love on Me",
    artist: "ABBA",
    is_explicit: 0,
    duration_ms: 0.278566215,
    danceability: 0.668016194,
    energy: 0.735465614,
    key: 0.181818182,
    loudness: 0.76291074,
    mode: 0,
    speechiness: 0.028990228,
    acousticness: 0.0866396811,
    instrumentalness: 0.00027412731,
    liveness: 0.423296339,
    valence: 0.785282258,
    tempo: 0.565862819
  }
]