---
sidebar_position: 2
---

# Configuration

The heart of SQLFlow is the pipeline configuration file. Each configuration file specifies:

- Command Configuration 
- Pipeline configuration
  - Source: Input configuration
  - Handler: SQL transformation
  - Sink: Output configuration

The following image shows a sample configuration file:

![example configuration file](./static/postgres_sink.png)

Every instance of SQLFlow needs a pipeline configuration file. Configuration examples are availble in turbolytics/sql-flow repo:

https://github.com/turbolytics/sql-flow/tree/main/dev/config/examples

## Command Configuration

Commands are SQL statements executed during pipeline initialization. These commands allow for ATTACHing databases to the pipeline context. The `commands` directive is a top level directive in the configuration file.

```yaml
commands:
  - name: load extensions
    sql: |
      INSTALL postgres;
      LOAD postgres;

  - name: attach usersdb
    sql: |
      ATTACH '{{ SQLFLOW_POSTGRES_USERS_URI|default('postgresql://postgres:postgres@localhost:5432/testdb') }}' AS pgusersdb (TYPE POSTGRES, READ_ONLY);
```

This example loads the DuckDB postgres extension and then attaches the postgres database to the pipeline context. The `commands` directive is optional.

It contains an array of commands to execute during pipeline initialization. The commands are executed in order.
 
## Pipeline Configuration

The pipeline configuration is the core of SQLFlow. It specifies the input source, handler, and output sink. The top level pipeline directive contains the following keys:

```yaml
pipeline:
  name: <pipeline-name>
  description: <pipeline-description>
  batch_size: <batch size>
  source:
    ...
  handler:
    ...
  sink:
    ...
```

The batch size is the number of rows to process in a single batch. The batch size is optional and defaults to 1.

A batch of 100 means 100 records will be read into SQLFlow before the handler processes the batch.

### Source Configuration

SQLFlow currently supports 2 sources:
- Kafka
- Websocket

The following shows an example of each:

```yaml
pipeline:
  ...
  source:
    type: kafka
    kafka:
      brokers: [{{ SQLFLOW_KAFKA_BROKERS|default('localhost:9092') }}]
      group_id: test
      auto_offset_reset: earliest
      topics:
        - "input-simple-agg-mem"
```

```yaml
pipeline:
  ...
  source:
    type: websocket
    websocket:
      uri: 'wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post'
```

Notice how each concrete source is located under the corresponding key. When `type: kafka` the kafka configuration is expected under the `kafka` key.

### Handler Configuration

Handlers are the heart of the SQLFlow pipeline. Handlers contain the SQL to execute against the input source. The handler configuration is located under the `handler` key.

```yaml
pipeline:
  ...
  handler:
    type: 'handlers.InferredMemBatch'
    sql: |
      SELECT * FROM batch
```

SQLFlow supports 3 handlers:
- handlers.InferredMemBatch: Infers the table schema using DuckDB Schema Inference, buffers the batch in memory.
- handlers.InferredDiskBatch: Infers the table schema using DuckDB Schema Inference, buffers the batch in disk.
- handlers.StructuredBatch: Requires the schema to be specified in the configuration file. This supports either in [memory](https://github.com/turbolytics/sql-flow/blob/main/dev/config/examples/kafka.structured.mem.yml) or on [disk](https://github.com/turbolytics/sql-flow/blob/main/dev/config/examples/kafka.structured.disk.yml). 

The most important part of the handler is the `sql` key. This is the SQL to execute against the input batch. The result of the SQL is written to the output sink. 

#### The `batch` Table

### Sink Configuration

SQLFlow supports the following sinks:
- Console (example)
- Kafka (example)
- Postgres (example)
- Filesystem 
- Iceberg ([example](https://github.com/turbolytics/sql-flow/blob/main/dev/config/examples/kafka.mem.iceberg.yml))
- Any output that DuckDB supports through the `sqlcommand` sink.

## User Defined Functions (UDF)

SQLFlow supports User Defined Functions (UDF) in the configuration file.

https://github.com/turbolytics/sql-flow/blob/main/dev/config/examples/udf.yml

UDF Supports loading a function from the $PYTHONPATH. This will require that the end user either:

- Loads their python file (without additional dependencies) into the docker container (such as -v /path/to/udf.py:/app/plugins/udf.py) and then adds the /app/plugins to the python path.
- Create a new dockerfile based on turbolytics/sql-flow and adds copying UDF code and installs requirements, then puts the UDF code on the $PYTHONPATH

## Testing Configuration

## Environmental Variables
