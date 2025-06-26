# 🦆 Sink Kafka to DuckLake with SQLFlow

SQLFlow now supports [DuckLake](https://duckdb.org/2025/05/27/ducklake.html) as a first-class sink, allowing you to write high-throughput streaming data directly into DuckDB-backed cloud-native tables.

In this guide, we’ll show how to:

* Start Kafka and SQLFlow locally
* Publish 1M events
* Stream them into DuckLake
* Query and verify the result

> ✅ **Before you begin**, set up your local environment:
> 👉 [Follow the Local Development Tutorial →](https://sql-flow.com/docs/tutorials/local-dev)

---

## 🔄 Step-by-Step Walkthrough

### 1. ✅ Start Kafka

```bash
make start-backing-services
```

---

### 2. 🧪 Publish 1M Events to Kafka

```bash
python3 cmd/publish-test-data.py --num-messages=1000000 --topic="input-user-clicks-ducklake"
```

---

### 3. ▶️ Start SQLFlow and Read 1M Events

```bash
SQLFLOW_BATCH_SIZE=1000 \
python3 cmd/sql-flow.py run dev/config/examples/kafka.ducklake.yml --max-msgs-to-process=1000000
```

---

### 4. 🔍 Verify Events Were Written to DuckLake

```sql
$ duckdb
    
INSTALL ducklake;
LOAD ducklake;

ATTACH 'ducklake:my_ducklake.ducklake' AS my_ducklake;
USE my_ducklake;

SELECT COUNT(*) FROM my_ducklake.events;
```

Expected output:

```
┌────────────────┐
│  count_star()  │
│     int64      │
├────────────────┤
│    1000000     │
│ (1.00 million) │
└────────────────┘
```

---

## 🛠️ Example SQLFlow Config [(`kafka.ducklake.yml`)](https://github.com/turbolytics/sql-flow/blob/main/dev/config/examples/kafka.ducklake.yml)

```yaml
commands:
  - name: install ducklake
    sql: |
      INSTALL ducklake;
      LOAD ducklake;
  - name: attach to ducklake
    sql: |
      ATTACH 'ducklake:my_ducklake.ducklake' AS my_ducklake;
      USE my_ducklake;
  - name: create events table if not exists
    sql: |
      CREATE TABLE IF NOT EXISTS my_ducklake.events (
        ip TEXT,
        event TEXT,
        properties_city TEXT,
        properties_country TEXT,
        timestamp TIMESTAMP,
        type TEXT,
        userId TEXT
      );

pipeline:
  batch_size: {{ SQLFLOW_BATCH_SIZE|default(1) }}
  source:
    type: kafka
    kafka:
      brokers: [{{ SQLFLOW_KAFKA_BROKERS|default('localhost:9092') }}]
      group_id: motherduck-sink-1
      auto_offset_reset: earliest
      topics:
        - "input-user-clicks-ducklake"

  handler:
    type: 'handlers.InferredMemBatch'
    sql: |
      INSERT INTO my_ducklake.events
      SELECT
        ip,
        event,
        properties ->> 'city' AS properties_city,
        properties ->> 'country' AS properties_country,
        CAST(timestamp AS TIMESTAMP) AS timestamp,
        type,
        userId
      FROM batch;

  sink:
    type: noop
```

---

## 📖 Configuration Breakdown

Let’s walk through the key sections of the config file:

### 🔹 `commands`

A list of SQL statements executed **before** the pipeline runs. In this case:

* `INSTALL` and `LOAD` DuckLake
* `ATTACH` a DuckLake database
* `CREATE TABLE` ensures the target table exists

This allows pipelines to prep any environment (e.g., attach catalogs, create schemas) before ingestion.

---

### 🔹 `pipeline.batch_size`

The number of Kafka messages to group together into a batch for processing.
In this example:

```yaml
batch_size: {{ SQLFLOW_BATCH_SIZE|default(1) }}
```

You can override this via environment variables for tuning performance.

---

### 🔹 `source`

Defines where data is **ingested** from.
Here, we pull from a Kafka topic using a group ID and consume from the beginning of the topic:

```yaml
source:
  type: kafka
  kafka:
    brokers: ['localhost:9092']
    group_id: motherduck-sink-1
    auto_offset_reset: earliest
    topics: ['input-user-clicks-ducklake']
```

---

### 🔹 `handler`

Defines the **SQL transformation** to apply to each batch of incoming data:

```yaml
handler:
  type: 'handlers.InferredMemBatch'
  sql: |
    INSERT INTO my_ducklake.events
    SELECT ...
```

This SQL uses DuckDB under the hood. It maps JSON fields to DuckLake columns and inserts the results.

---

### 🔹 `sink`

The **sink** determines where to write the processed data.

```yaml
sink:
  type: noop
```

In this case, the sink is a **noop** (no output), because the SQL statement is already performing an `INSERT INTO` DuckLake. If you wanted to write to another system (e.g., Kafka, S3), you’d use a different sink type.

---

For questions, feedback, or to contribute—[reach out here](https://github.com/turbolytics/sql-flow/issues) or email [danny@turbolytics.io](mailto:danny@turbolytics.io).
