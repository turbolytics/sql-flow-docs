# FAQ

## What is SQLFlow?

SQLFlow is a python-based stream processor. It embeds DuckDB using the python DuckDB library. All stream processing is performed using DuckDB. SQLFlow supports a number of "sources" for ingesting data, and "sinks" for writing data.

## How is SQLFLow different than Flink?

SQLFlow is based on python. It is deployed as a single process. Horizontal scaling can be achieved through the use of Kafka consumer groups. SQLFlow has considerably less features than Flink, especially around windowing and aggregations. SQLFlow leverages optimized C library bindings for Arrow, DuckDB and Dafka to achieve high performance processing. Think of SQLFlow as the DuckDB of stream processing. It enables companies to handle stream processing at scale in a lightweight package that is easy to operate, configure and understand, and is cost effective.

## Why would I run SQLFlow?

SQLFlow is a good fit if your data throughput < 30k messages per second. It is a good fit for simple stream enrichment, tumbling window aggregations, enhancing streaming data using custom functions (through UDFs). SQLFLow as a great way to create lightweight stream processing for high throughput data streams.
