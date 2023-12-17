# Stream Utils

## Chatbox

Usage:

```
<BASE_URL>/chatbox/<channel>?align=[left|right]&slideOutDelay=<seconds>
```

Query Params

| Key           | Value Type | Valid value       | Description                                                      |
| ------------- | ---------- | ----------------- | ---------------------------------------------------------------- |
| align         | string     | `left` or `right` |                                                                  |
| slideOutDelay | number     |                   | Delay for the message to slide out after popping in (in seconds) |

## Lastfm

Usage:

```
<BASE_URL>/lastfm/<username>
```

Query Params

| Key             | Value Type | Valid value       | Description                                                         |
| --------------- | ---------- | ----------------- | ------------------------------------------------------------------- |
| align           | string     | `left` or `right` |                                                                     |
| refetchInterval | number     |                   | Last.fm API call refetching interval (in seconds). Minimum 1 second |

Note: this requires `VITE_LASTFM_API_KEY` to be set while executing `build` script
