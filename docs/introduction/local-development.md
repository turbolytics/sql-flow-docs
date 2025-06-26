# Local Development

Want to get started with streaming SQL pipelines on your laptop? This tutorial walks through running **SQLFlow** locally—from validating a config file to streaming Kafka data and verifying output.

SQLFlow is like **DuckDB for streaming data**—just bring your SQL.

---

## 🔧 Prerequisites

* Python 3.9+
* Docker + Docker Compose
* `make` installed
* `git` installed

---

## 1. 🐍 Install Python Dependencies

Clone the SQLFlow repo and install required packages:

```bash
git clone https://github.com/turbolytics/sql-flow.git
cd sql-flow

# Install runtime and development dependencies
pip install -r requirements.txt
pip install -r requirements.dev.txt

# If you run into issues with librdkafka:
C_INCLUDE_PATH=/opt/homebrew/Cellar/librdkafka/2.3.0/include \
LIBRARY_PATH=/opt/homebrew/Cellar/librdkafka/2.3.0/lib \
pip install confluent-kafka

make setup-dev
```

---

## 2. ✅ Validate a Config with Test Data

Use the `invoke` CLI to test your SQLFlow pipeline configuration locally with sample data:

```bash
python3 cmd/sql-flow.py dev invoke dev/config/examples/basic.agg.yml dev/fixtures/simple.json
```

Expected output:

```json
['{"city":"New York","city_count":28672}', '{"city":"Baltimore","city_count":28672}']
```

---

## 3. 📡 Start Kafka Locally

Start Kafka using Docker Compose:

```bash
make start-backing-services
# or manually:
docker-compose -f dev/kafka-single.yml up -d
```

---

## 4. 🚀 Publish Test Data to Kafka

Send test events into Kafka:

```bash
python3 cmd/publish-test-data.py --num-messages=10000 --topic="input-simple-agg-mem"
```

---

## 5. ▶️ Run SQLFlow Against Kafka

Start the SQLFlow engine locally to process events from Kafka:

```bash
SQLFLOW_KAFKA_BROKERS=localhost:9092 \
python3 cmd/sql-flow.py run dev/config/examples/basic.agg.mem.yml --max-msgs-to-process=10000
```

---

## 6. 🧪 Verify Output

Open a Kafka consumer to read results:

```bash
docker exec -it kafka1 kafka-console-consumer \
  --bootstrap-server=kafka1:9092 \
  --topic=output-simple-agg-mem
```

You should see real-time results like:

```json
{"city":"San Francisco504","city_count":1}
{"city":"San Francisco735","city_count":1}
...
```

---

## 🎉 Success!

You’ve just run a real-time SQL pipeline on your laptop—using Kafka, DuckDB, and SQLFlow locally.

---

Need support or want to contribute?

📩 [danny@turbolytics.io](mailto:danny@turbolytics.io)
📂 [Open an issue](https://github.com/turbolytics/sql-flow/issues)