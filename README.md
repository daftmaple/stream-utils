# Stream Utils

## Chatbox

Usage:

```
<BASE_URL>/chatbox/<channel>?align=[left|right]&slideOutDelay=<seconds>
```

Query Params

| Key           | Value Type | Valid value       |
| ------------- | ---------- | ----------------- |
| align         | string     | `left` or `right` |
| slideOutDelay | number     |                   |

## Lastfm

Usage:

```
<BASE_URL>/lastfm/<username>
```

Note: this requires `VITE_LASTFM_API_KEY` to be set while executing `build` script
