# public/

Remotion serves this folder through `staticFile()`. Generated assets land here:

| Path | Written by |
|------|-----------|
| `audio/scene-XX.mp3` + `audio/scene-XX.words.json` | `npm run voice` |
| `broll/scene-XX.mp4` | `npm run broll` |
| `music/bed.mp3` (optional, per `storyboard.music`) | you |

Everything except this file is gitignored — regenerate it any time with `npm run voice`
and `npm run broll`.
