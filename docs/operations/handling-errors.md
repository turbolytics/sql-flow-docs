---
sidebar_position: 1
---

# Handling Errors

SQLFlow provides flexible strategies for managing runtime errors during stream processing. This allows you to tailor error handling based on your production reliability needs.

## Overview

SQLFlow supports three error handling policies:

| Policy  | Description |
|---------|-------------|
| `RAISE` _(default)_ | Crashes the pipeline on any error. Best for development and strict correctness. |
| `IGNORE` | Suppresses errors. Logs and counts them via Prometheus metrics. |
| `DLQ` (Dead-Letter Queue) | Sends failed messages to a configured DLQ (e.g., Kafka) for debugging or re-processing. |

These are set via the `pipeline.on_error.policy` field in your pipeline YAML configuration.

---

## Configuring Error Handling

### `RAISE` (default)

```yaml
pipeline:
  on_error:
    policy: RAISE
```

Behavior:
- Immediately stops on error.
- Logs full tracebacks.
- Recommended for development environments, or where strict correctness is required.

---

### `IGNORE`

```yaml
pipeline:
  on_error:
    policy: IGNORE
```

Behavior:
- Logs the error with message content.
- Emits Prometheus metrics:
  ```plaintext
  error_count_total{phase="handler.{write|invoke}} 1
  ```

Use case:
- Non-critical data loss is acceptable, and system uptime is prioritized.

---

### `DLQ` (Dead-Letter Queue)

```yaml
pipeline:
  on_error:
    policy: DLQ
    dlq:
      type: kafka
      kafka:
        brokers: ["localhost:9092"]
        topic: "dlq-topic"
```

Behavior:
- Captures errors and publishes them to Kafka.
- Structured error messages include:
  ```json
  {
    "error": "Expecting value: line 1 column 1 (char 0)",
    "message": "!invalid!",
    "phase": "handler.write",
    "timestamp": "2025-06-15T01:27:54.931754+00:00"
  }
  ```

Use case:
- Data must be preserved for future inspection or reprocessing.

---

## Monitoring with Prometheus

Enable metrics by passing `--metrics=prometheus`:

```bash
python3 cmd/sql-flow.py run --metrics=prometheus dev/config/examples/kafka.dlq.yml
```

Then query:

```bash
curl http://localhost:8000/metrics
```

Key metrics:
- `error_count_total{phase=...}` — Number of errors by type.
- `message_count_messages_total` — Total processed messages.

---

## Testing Your Error Strategy

You can manually test each strategy by sending invalid JSON or malformed SQL to your input source (e.g., Kafka). Check logs, DLQ topic output, or Prometheus metrics to confirm expected behavior.

---

## Summary

- Use `RAISE` for strict correctness during development.
- Use `IGNORE` for best-effort processing.
- Use `DLQ` for resilient pipelines with post-error inspection.

Each strategy provides visibility into failures without blocking your pipeline. Choose the one that fits your operational tolerance.