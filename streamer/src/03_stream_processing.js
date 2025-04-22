let s = {
    $source: {
        connectionName: "sample_stream_solar"
    }
}

let g = {
    $group: {
        _id: "$group_id",
        max_temp: {
            $avg: "$obs.temp"
        },
        avg_watts: {
            $min: "$obs.watts"
        },
        median_watts: {
            $min: "$obs.watts"
        },
        max_watts: {
            $max: "$obs.watts"
        },
        min_watts: {
            $min: "$obs.watts"
        }
    }
}

let t = {
    $tumblingWindow: {
        interval: {
            size: NumberInt(10),
            unit: "second"
        },
        pipeline: [g]
    }
}

let m = {
    $merge: {
        into: {
            connectionName: "solar_db",
            db: "linkaja",
            coll: "solar_db"
        }
    }
}

sp.createStreamProcessor("solarDemo", [s, t, m])

sp.solarDemo.start()

